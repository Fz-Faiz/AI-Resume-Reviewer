from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

from microservices.analyze_resume import analyze_resume
from microservices.chat_resume import upload_resume, chat_resume

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

@app.get("/")
def root():
    return "AI Resume Reviewer is running"

@app.post("/analyze")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    try:
        temp_path = "temp_resume.pdf"
        print("DEBUG: File received. Size =")
        with open(temp_path, 'wb') as temp_file:
            temp_file.write(await file.read())
        print("i reached here")
        result = analyze_resume(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
    print("BACKEND ERROR:\n", traceback.format_exc())
    return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/chat/upload")
async def upload_resume_endpoint(file: UploadFile = File(...)):
    try:
        temp_path = "temp_chat_resume.pdf"
        with open(temp_path, "wb") as temp_file:
            temp_file.write(await file.read())

        result = upload_resume(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/chat")
async def chat_resume_endpoint(question: str = Form(...)):
    try:
        result = chat_resume(question)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
