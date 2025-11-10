from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pdfminer.high_level import extract_text
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatGroq(model="llama-3.1-8b-instant", temperature=0.3)
parser = StrOutputParser()

resume_context = ""
chat_history=[]


def upload_resume(file_path):
    global resume_context, chat_history
    try:
        resume_context = extract_text(file_path)
        chat_history=[]
        return {"message": "Resume uploaded successfully"}
    except Exception as e:
        return {"error":str(e)}
    
    
    
def chat_resume(question):
    
    global chat_history, resume_context
    
    try:
        if not resume_context:
            return {"message":"upload resume first"}
        
        chat_history.append(HumanMessage(content=question))
        
        conversation = "\n".join(
            [f"User: {m.content}" if isinstance(m, HumanMessage) else f"AI: {m.content}"
             for m in chat_history]
        )
        
        prompt = PromptTemplate(
            template="""
            You are an AI resume coach.

            Here is the user's resume:
            {resume_text}

            Conversation so far:
            {conversation}

            User's latest question:
            {question}

            Respond clearly, professionally, and concisely.
            If user requests rewrite or improvements, provide them.
            """,
            input_variables=['resume_text', 'conversation', 'question']
        )
        
        chain = prompt | model | parser
        
        result = chain.invoke({
            'resume_text': resume_context,
            'conversation': conversation,
            'question':question,
        }).strip()
        
        chat_history.append(AIMessage(content=result))
        
        return {"result": result}
    except Exception as e:
        return {"error", str(e)}
        
        