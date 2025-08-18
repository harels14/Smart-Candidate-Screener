from fastapi import APIRouter,UploadFile,File,Form
import PyPDF2
from io import BytesIO
from app.models.cvExaminate import cv_analyzer
router = APIRouter() #Create router / sub application


async def process_single_cv(file: UploadFile,job_desc: str):
    try:
        if file.filename.lower().endswith('.pdf'):
            contents = await file.read()
            text = extract_text_from_pdf_bytes(contents)
        elif file.filename.lower().endswith('.txt'):
            content = await file.read()
            text = content.decode('utf-8')
        else:
            return {"error": "Unsupported file type"}

        claude_response = await cv_analyzer(text, job_desc)
        return claude_response

    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}


@router.post("/upload-cv")  #Upload and process single file
async def upload_cv(file: UploadFile = File(...), job_desc: str = Form(...)):

    return await process_single_cv(file, job_desc)


@router.post("/upload-cvs") #Upload and process multiple files
async def upload_cvs(files: list[UploadFile] = File(...), job_desc: str = Form(...)):
    results = []

    for i,file in enumerate(files):
        analysis = await process_single_cv(file,job_desc)

        results.append({
            "file_index": i,
        "file_name" : file.filename,
            "analysis": analysis
        })
    return {
        "total_files": len(files),
        "job_description": job_desc,
        "results": results
    }



def extract_text_from_pdf_bytes(file_bytes: bytes) -> list[str]:
    pdf_text = []
    pdf_stream = BytesIO(file_bytes)
    reader = PyPDF2.PdfReader(pdf_stream,strict=False)
    for page in reader.pages:
            content = page.extract_text()
            pdf_text.append(content)
    return pdf_text


