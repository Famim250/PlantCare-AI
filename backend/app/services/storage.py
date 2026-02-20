import os
import uuid

def upload_mock_s3(content: bytes, filename: str) -> str:
    """Mocks uploading a file to an S3 bucket and returning a public URL"""
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Guard against None or empty filename
    fname = filename or "upload.jpg"
    file_extension = fname.split(".")[-1] if "." in fname else "jpg"
    safe_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    return f"/static/{safe_filename}"
