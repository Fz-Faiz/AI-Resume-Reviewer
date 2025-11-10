from langchain_groq import ChatGroq
from pdfminer.high_level import extract_text
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel,Field
from dotenv import load_dotenv

load_dotenv()


class ATSAnalysis(BaseModel):
    score: int = Field(description="ATS score between 0 and 100")
    missing_keywords: list[str] = Field(description="List of missing or weak keywords")
    suggestions: list[str] = Field(description="List of actionable improvement suggestions")



def analyze_resume(pdf_file):
    try:
        pdf_text = extract_text(pdf_file)
        
        model = ChatGroq(model="llama-3.1-8b-instant", temperature=0.3)
        
        parser = PydanticOutputParser(pydantic_object=ATSAnalysis)
        
        prompt = PromptTemplate(
            template="""
            You are an expert ATS (Applicant Tracking System) evaluator.
            Analyze this resume and provide feedback **strictly in JSON format** matching the given schema.
            
            Resume Text: 
            {resume_text}
            
            {format_instructions}""",
            input_variables=['resume_text'],
            partial_variables={'format_instructions':parser.get_format_instructions()},
        )
        
        chain = prompt | model | parser
        
        result = chain.invoke({
            "resume_text":pdf_text
        })
        
        ats_result = ATSAnalysis(**result)
        
        return {
            "message":"Resume analyzed successfully",
            "ats_score": ats_result.score,
            "missing_keywords":ats_result.missing_keywords,
            "suggestions":ats_result.suggestions
        }
    except Exception as e:
        return {"error": str(e)}
    
    
