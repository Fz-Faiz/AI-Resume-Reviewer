from fastapi import FastAPI,File,UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from services.microservices.analyze_resume import analyze_resume

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    with_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)


@app.get("/")
def root():
    return "AI Resume Reviewer is running"

@app.post("/ananlyze")
async def analyze_resume_endpoint(file: UploadFile= File(...)):
    try:
        
        temp_path = "temp_resume.pdf"
        with open(temp_path,'wb') as temp_file:
            temp_file.write(await file.read())
        
        result = analyze_resume(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        return JSONResponse(
            content={"error", str(e)}, status_code=500
        )
        
@app.post("/chat/upload")
async def upload_resume_endpoint(file: UploadFile = File(...)):
    try:
        temp_path="temp_chat_resume.pdf"
        with open(temp_path,"wb") as temp_file:
            temp_file.write(await file.read())

        result = upload_resume(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)}, status_code=500
        )
        
@app.post("/chat")
async def chat_resume_endpoint(qustion: str = Form(...)):
    try:
        result = chat_resume(question)
        JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)}, status_code=500
        )

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)


