import os
import uuid
import shutil
from fastapi import UploadFile

def upload_mock_s3(file: UploadFile) -> str:
    """Mocks uploading a file to an S3 bucket and returning a public URL"""
    # In a real app this would upload to S3 and return the s3 url
    # For now we'll save it locally to a static folder for demo purposes
    
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = file.filename.split(".")[-1]
    safe_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    # We need to read the file, but we should reset the cursor since the route also reads it
    file.file.seek(0)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file.file.seek(0)
        
    return f"/static/{safe_filename}"
