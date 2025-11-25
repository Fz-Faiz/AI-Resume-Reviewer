from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import os

from microservices.analyze_resume import analyze_resume
from microservices.chat_resume import upload_resume, chat_resume,  extract_text_from_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

class ChatRequest(BaseModel):
    question: str

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
async def chat_resume_endpoint(body: ChatRequest):
    try:
        print("🔥 DEBUG: Received question =", body.question)

        result_dict = chat_resume(body.question)  # no await

        ai_message = result_dict.get("result")    # <--- FIX

        print("🔥 DEBUG: Chat result =", ai_message)

        return {"answer": ai_message}  # return clean string
    except Exception as e:
        import traceback
        print("❌ FASTAPI CHAT ERROR:")
        print(traceback.format_exc())
        return JSONResponse(content={"error": str(e)}, status_code=500)


    
@app.post("/textExtract")
async def extract_resume_endpoint(file: UploadFile = File(...)):
    try:
        temp_path = "temp_chat_resume.pdf"
        with open(temp_path, "wb") as temp_file:
            temp_file.write(await file.read())

        result =  extract_text_from_pdf(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
