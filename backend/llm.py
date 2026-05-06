import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ✅ OLD FUNCTION (KEEP THIS)
def generate_response(prompt: str):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


# ✅ NEW FUNCTION (for LangGraph later)
def call_llm(input_text: str):
    return generate_response(input_text)