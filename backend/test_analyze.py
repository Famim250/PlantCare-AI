import requests
import io
from PIL import Image

# Create a 2MB dummy image to force FastAPI to use SpooledTemporaryFile
img = Image.new('RGB', (2000, 2000), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_bytes = img_byte_arr.getvalue()

data = {
    "cropType": "auto",
    "mode": "advanced"
}
files = {
    "image": ("test_large.jpg", img_bytes, "image/jpeg")
}

try:
    res = requests.post("http://localhost:8000/analyze", data=data, files=files)
    with open("error.txt", "w") as f:
        f.write(res.text)
    print("STATUS", res.status_code)
except Exception as e:
    print(e)
