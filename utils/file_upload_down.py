import tempfile
import requests
import os
import cloudinary
from dotenv import load_dotenv

from utils.file_handler import extract_links_from_docx, extract_links_from_pdf, extract_text_from_docx, extract_text_from_docx_layout, extract_text_from_pdf, extract_text_from_pdf_layout
load_dotenv()
cloudinary.config(
  cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key=os.getenv("CLOUDINARY_API_KEY"),
  api_secret=os.getenv("CLOUDINARY_API_SECRET"),
  secure=True
)

import os
from urllib.parse import urlparse, unquote

def split_cloudinary_pdf_url(url):
    parsed_url = urlparse(url)
    path = unquote(parsed_url.path)  
    
    filename = os.path.basename(path)  

    # base, ext = os.path.splitext(filename)

    # base_url = url.rsplit(ext, 1)[0]

    return filename
    
def download_and_process_resume_from_url(file_url, layout,ext):
    print("File URL",file_url)
    if not layout:
        layout = "false"
    filename = str(split_cloudinary_pdf_url(file_url)) + str(ext)
    try:
        response = requests.get(file_url)
        print("Response",response)
        print("Response code",response.status_code)
        if response.status_code != 200:
            raise ValueError("Failed to download file")

        extension = ext
        if extension not in [".pdf", ".docx"]:
            raise ValueError("Unsupported file format")

        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
            tmp.write(response.content)
            tmp.flush()
            tmp_path = tmp.name

        if extension == ".pdf":
            extracted_text = (
                extract_text_from_pdf_layout(tmp_path)
                if layout == "true"
                else extract_text_from_pdf(tmp_path)
            )
            links = extract_links_from_pdf(tmp_path)
        elif extension == ".docx":
            extracted_text = (
                extract_text_from_docx_layout(tmp_path)
                if layout == "true"
                else extract_text_from_docx(tmp_path)
            )
            links = extract_links_from_docx(tmp_path)
        else:
            os.remove(tmp_path)
            return None, None

        os.remove(tmp_path)
        return extracted_text, links , filename

    except Exception as e:
        print("Error downloading or processing file:", str(e))
        return None, None

    
def upload_file_to_cloudinary(file):
    """Upload a file to Cloudinary and return the URL"""
    try:
        print("File",file)
        print("File name",file.filename)    
        result = cloudinary.uploader.upload(
            file,
            resource_type="raw",  # PDFs are non-image
            folder="resumes",
            public_id=os.path.splitext(file.filename)[0]
        )
        ext = os.path.splitext(file.filename)[1]
        print("Result",ext)
        return result,ext
    except Exception as e:
        print("Error uploading file to Cloudinary:", str(e))
        return None
    
if __name__ == "__main__":
    url = "https://res.cloudinary.com/dv3x6cup2/raw/upload/v1747647642/resumes/Resume%202025%20latex"
    res = download_and_process_resume_from_url(url,layout="false",ext=".pdf")
    print("Result",res)