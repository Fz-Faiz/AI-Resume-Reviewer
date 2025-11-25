from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()

model = ChatGroq(model="llama-3.1-8b-instant", temperature=0.3)
parser = StrOutputParser()

resume_context = ""
chat_history = []

def upload_resume(file_path):
    global resume_context, chat_history
    try:
        resume_context = extract_text_from_pdf(file_path)
        chat_history = []
        print("🔥 resume_context first 200 chars =", resume_context[:200])
        print("🔥 resume_context length =", len(resume_context))

        return {"message": "pdf successfully uploaded"}
    except Exception as e:
        return {"error": str(e)}


def chat_resume(question):
    global chat_history, resume_context

    try:
        if not resume_context:
            return {"message": "upload resume first"}

        chat_history.append(HumanMessage(content=question))

        conversation = "\n".join(
            [
                f"User: {m.content}" if isinstance(m, HumanMessage)
                else f"AI: {m.content}"
                for m in chat_history
            ]
        )

        prompt = PromptTemplate(
            template="""
            You are ResumeReviewerAI.

            RULES:
            1. NEVER invent or hallucinate ANY resume content.
            2. NEVER generate a new resume unless the user specifically asks.
            3. If the question is NOT related to the resume, respond like a normal assistant.
            4. But DO NOT mention ANY resume-like content unless user asks.
            5. If the user message is like "hi", "hello", "how are you", respond normally and briefly.
            6. If the user asks resume-related questions, ALWAYS use ONLY the resume_text below.

            --- RESUME ---
            {resume_text}

            --- CONVERSATION ---
            {conversation}

            --- USER QUESTION ---
            {question}
            """
            ,
            input_variables=['resume_text', 'conversation', 'question']
        )

        chain = prompt | model | parser

        result = chain.invoke({
            'resume_text': resume_context,
            'conversation': conversation,
            'question': question,
        }).strip()

        chat_history.append(AIMessage(content=result))

        return {"result": result}

    except Exception as e:
        return {"error": str(e)}


def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text
