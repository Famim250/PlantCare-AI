import json
import logging
import time
import os
import google.generativeai as genai
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("plantcare")

# Configure Gemini
_gemini_configured = False
if hasattr(settings, 'gemini_api_key') and settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
    _gemini_configured = True
else:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
        _gemini_configured = True


def analyze_plant_image(image_bytes: bytes, max_retries: int = 2) -> Optional[Dict[str, Any]]:
    """
    Send the raw image to Gemini Vision and get a complete plant analysis.
    Returns None if Gemini is unavailable or fails (caller should fallback to MobileNetV2).
    Retries on rate limit errors (HTTP 429).
    """
    if not _gemini_configured:
        logger.warning("Gemini API key not configured, skipping vision analysis")
        return None

    for attempt in range(max_retries + 1):
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")

            # Send image bytes directly to Gemini (it accepts raw bytes)
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }

            prompt = """You are an expert plant pathologist and agricultural scientist.
Analyze this plant/leaf image carefully and return ONLY valid JSON (no markdown, no explanation).

Your JSON must have EXACTLY these keys:

{
  "plant_name": "Common name of the plant (e.g. Tomato, Rose, Mango)",
  "disease_name": "Name of disease detected, or 'Healthy' if no disease",
  "disease_id": "kebab-case ID like 'tomato-early-blight' or 'rose-healthy'",
  "severity": "low" or "medium" or "high",
  "confidence": 0.0 to 1.0 (your confidence in the diagnosis),
  "health_score": 0 to 100 (overall plant health),
  "leaf_condition": 0 to 100 (how healthy the leaf tissue looks),
  "infection_severity": 0 to 100 (how severe the infection/damage is, 0 if healthy),
  "color_analysis": 0 to 100 (how normal the leaf coloring is),
  "beginner_description": "Simple 1-2 sentence explanation for a beginner gardener",
  "advanced_description": "Detailed pathological assessment for an expert",
  "recommendations": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "treatment": {
    "immediate": ["step 1", "step 2", "step 3"],
    "organic": ["step 1", "step 2"],
    "chemical": ["step 1", "step 2"],
    "prevention": ["step 1", "step 2", "step 3"],
    "recoveryTimeline": "Expected recovery duration"
  }
}

Rules:
- If the plant is healthy, set severity to "low", infection_severity to 0, health_score to 90-100
- Be accurate about the plant species — look at leaf shape, color, texture, veins
- Provide realistic health scores based on what you actually see in the image
- Return ONLY the JSON object, nothing else"""

            response = model.generate_content([prompt, image_part])

            # Clean response text
            json_text = response.text.strip()
            if json_text.startswith("```json"):
                json_text = json_text[7:]
            if json_text.startswith("```"):
                json_text = json_text[3:]
            if json_text.endswith("```"):
                json_text = json_text[:-3]
            json_text = json_text.strip()

            result = json.loads(json_text)

            # Validate required fields exist
            required = ["plant_name", "disease_name", "disease_id", "severity",
                         "confidence", "health_score", "leaf_condition",
                         "infection_severity", "color_analysis"]
            for key in required:
                if key not in result:
                    logger.error(f"Gemini response missing required key: {key}")
                    return None

            logger.info(f"Gemini Vision identified: {result['plant_name']} - {result['disease_name']} "
                         f"(confidence: {result['confidence']}, health: {result['health_score']})")

            return result

        except json.JSONDecodeError as e:
            logger.error(f"Gemini returned invalid JSON: {e}")
            return None
        except Exception as e:
            error_str = str(e)
            # Retry on rate limit (429) errors
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                wait_time = (attempt + 1) * 5  # 5s, 10s
                logger.warning(f"Gemini rate limited (attempt {attempt+1}/{max_retries+1}), retrying in {wait_time}s...")
                if attempt < max_retries:
                    time.sleep(wait_time)
                    continue
                else:
                    logger.error(f"Gemini rate limited after {max_retries+1} attempts, falling back")
                    return None
            else:
                logger.error(f"Gemini Vision analysis failed: {e}")
                return None
    
    return None
