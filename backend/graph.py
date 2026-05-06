from langgraph.graph import StateGraph
from typing import TypedDict

from database import SessionLocal

from agent import agent_router


# -----------------------------------
# STATE
# -----------------------------------
class AgentState(TypedDict):
    input: str
    output: dict


# -----------------------------------
# MAIN NODE
# -----------------------------------
def decide_and_act(state: AgentState):

    user_input = state["input"]

    db = SessionLocal()

    try:

        # ALL LOGIC HANDLED INSIDE agent.py
        result = agent_router(user_input, db)

        return {
            "output": result
        }

    finally:
        db.close()


# -----------------------------------
# LANGGRAPH SETUP
# -----------------------------------
builder = StateGraph(AgentState)

builder.add_node("agent", decide_and_act)

builder.set_entry_point("agent")

builder.set_finish_point("agent")

graph = builder.compile()