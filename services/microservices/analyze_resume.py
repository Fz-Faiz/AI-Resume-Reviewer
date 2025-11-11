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
            You are an expert ATS evaluator and resume optimization specialist like **ResumeWorded.com**.

            Analyze the following resume for a **Software Developer / MERN Stack role** and give precise, recruiter-level insights.

            ### Evaluation Focus (Total Score out of 100)
            Distribute scoring across these weighted categories:
            - **Technical Skills (20 pts)** - MERN stack, APIs, Git, Databases, etc.
            - **Projects & Impact (20 pts)** – Quality, outcomes, measurable achievements, impact metrics.
            - **Experience & Achievements (15 pts)** – Clear results, quantified performance, leadership, teamwork.
            - **Certifications (10 pts)** – Relevant, credible tech certifications.
            - **Relevance to Role (15 pts)** – Keywords and technologies aligning with a developer position.
            - **Clarity & Communication (10 pts)** – Brevity, formatting, readability, structure.
            - **Presentation & Professionalism (10 pts)** – Layout, consistency, section organization.

            ### Keyword Extraction
            Identify critical **missing or weak keywords** that recruiters and ATS systems look for.
            Focus on:
            - Technical stack (React, Node.js, Express, MongoDB, API, Git, etc.)
            - Development processes (REST, Agile, CI/CD, Testing)
            - Tools (Docker, AWS, Firebase, Postman, etc.)

            ### Improvement Suggestions
            Give **3–6 actionable, recruiter-style suggestions** that:
            - Start with **clear verbs** like “Add,” “Include,” “Refine,” “Quantify,” “Highlight,” etc.
            - Mimic the tone of ResumeWorded feedback (professional, concise, result-oriented).
            - Help the user strengthen weak sections, improve impact, and boost ATS compatibility.
            - Address achievements, formatting, keyword balance, and role alignment.

            ### Output Format
            Return your analysis **strictly** in this JSON structure:
            {format_instructions}

            Resume Text:
            {resume_text}
            """,
            input_variables=['resume_text'],
            partial_variables={'format_instructions':parser.get_format_instructions()},
        )
        
        chain = prompt | model | parser
        
        result = chain.invoke({
            "resume_text":pdf_text
        })
        
        ats_result = result
        
        return {
            "message":"Resume analyzed successfully",
            "ats_score": ats_result.score,
            "missing_keywords":ats_result.missing_keywords,
            "suggestions":ats_result.suggestions
        }
    except Exception as e:
        return {"error": str(e)}
    
    
