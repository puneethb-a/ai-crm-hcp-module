from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from llm import generate_response
from agent import agent_router
from graph import graph
import models, schemas

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models.Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "API working 🚀"}


# ✅ LOG INTERACTION API
@app.post("/log-interaction")
def log_interaction(data: schemas.InteractionCreate, db: Session = Depends(get_db)):
    new_interaction = models.Interaction(
        hcp_name=data.hcp_name,
        date=data.date,
        summary=data.summary,
        key_points=data.key_points,
        next_action=data.next_action
    )

    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)

    return {"message": "Interaction logged successfully", "id": new_interaction.id}

@app.get("/test-llm")
def test_llm():
    prompt = "Summarize: Met doctor and discussed heart medicine."
    result = generate_response(prompt)
    return {"response": result}

@app.post("/chat")
def chat(input: dict, db: Session = Depends(get_db)):
    user_message = input.get("message")
    result = agent_router(user_message, db)
    return result

@app.post("/langgraph-chat")
def langgraph_chat(input: dict):
    result = graph.invoke({"input": input["message"]})
    return result