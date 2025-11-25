from langchain_groq import ChatGroq
from pdfminer.high_level import extract_text
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import json, re

load_dotenv()


class ATSAnalysis(BaseModel):
    score: int = Field(description="ATS score between 0 and 100")
    missing_keywords: list[str] = Field(description="List of missing or weak keywords")
    suggestions: list[str] = Field(description="List of actionable improvement suggestions")


def analyze_resume(pdf_file):
    try:
        pdf_text = extract_text(pdf_file)

        model = ChatGroq(
            model="llama-3.1-8b-instant",  
            temperature=0.1
        )

        parser = PydanticOutputParser(pydantic_object=ATSAnalysis)


        prompt = PromptTemplate(
            template="""
            You are an **expert ATS evaluator and resume optimization specialist**, similar to **ResumeWorded.com**.

            Analyze the following resume for a **Software Developer / MERN Stack role** and provide concise, recruiter-level insights.

            ---

            ### Evaluation Focus (Total Score out of 100)
            Distribute scoring across these weighted categories:
            - **Technical Skills (20 pts)** – MERN stack, APIs, Git, Databases, Cloud, Testing.
            - **Projects & Impact (20 pts)** – Quality, outcomes, measurable achievements.
            - **Experience & Achievements (15 pts)** – Quantified results, leadership, collaboration.
            - **Certifications (10 pts)** – Relevance and credibility.
            - **Relevance to Role (15 pts)** – Developer-specific keywords and technologies.
            - **Clarity & Communication (10 pts)** – Formatting, readability, structure.
            - **Presentation & Professionalism (10 pts)** – Consistency and design polish.

            ---

            ###  Keyword Extraction
            List **6-8 missing or weak keywords** that ATS systems and recruiters expect.
            Focus on:
            - MERN stack technologies (React, Node.js, Express, MongoDB)
            - Development tools (Git, REST, API, Docker, AWS, Postman)
            - DevOps or CI/CD practices

            ---

            ###  Improvement Suggestions
            Give **3–6 actionable suggestions** that:
            - Start with strong verbs (e.g., *Add*, *Refine*, *Highlight*, *Quantify*, *Include*).
            - Sound like professional feedback from **ResumeWorded.com**.
            - Focus on improving impact, clarity, and ATS performance.

            ---

            ###  Output Format
            Return your final evaluation strictly in this JSON format:
            {format_instructions}

            ---

            📄 Resume Text:
            {resume_text}
            """,
            input_variables=["resume_text"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

 
        raw_output = model.invoke(
            prompt.format(resume_text=pdf_text)
        )

        text_output = raw_output.content if hasattr(raw_output, "content") else str(raw_output)

        json_match = re.search(r"\{.*\}", text_output, re.S)
        if json_match:
            clean_json = json_match.group()
            data = json.loads(clean_json)
            parsed = ATSAnalysis(**data)
        else:
            raise ValueError("No valid JSON found in model response")

        return {
            "message": "Resume analyzed successfully",
            "ats_score": parsed.score,
            "missing_keywords": parsed.missing_keywords,
            "suggestions": parsed.suggestions,
        }

    except Exception as e:
        return {"error": str(e)}
