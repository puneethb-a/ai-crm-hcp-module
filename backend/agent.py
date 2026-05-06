from datetime import datetime
from llm import generate_response
from sqlalchemy.orm import Session
import models
import json
import re
from langchain.tools import tool


# -----------------------------------
# LANGCHAIN TOOL
# -----------------------------------
@tool
def log_interaction(input_text: str):
    """Log a new HCP interaction from text"""
    return input_text


# -----------------------------------
# SAFE JSON EXTRACTION
# -----------------------------------
def extract_json(text):

    try:

        matches = re.findall(r'\{.*?\}', text, re.DOTALL)

        for match in matches:

            try:
                return json.loads(match)

            except:
                continue

    except:
        pass

    # fallback
    return {
        "hcp_name": "Unknown",
        "date": "",
        "time": "",
        "summary": text,
        "key_points": "",
        "sentiment": "",
        "next_action": "Follow up"
    }


# -----------------------------------
# LOG INTERACTION TOOL
# -----------------------------------
def log_interaction_tool(user_input: str, db: Session):

    prompt = f"""
You are an AI assistant for a pharma CRM.

Extract structured interaction data from the text.

IMPORTANT:
- Always extract date in YYYY-MM-DD format.
- Always extract time in 12-hour format like "4 PM".
- Never return military/24-hour format.
- Convert relative dates like "today".
- Generate professional next_action.
- Detect sentiment carefully.

VALID SENTIMENTS:
- positive
- negative
- neutral

Return ONLY valid JSON.

Input:
{user_input}

JSON format:
{{
    "hcp_name": "",
    "date": "",
    "time": "",
    "summary": "",
    "key_points": "",
    "sentiment": "",
    "next_action": ""
}}
"""

    result = generate_response(prompt)

    data = extract_json(result)

    # -----------------------------------
    # SENTIMENT FALLBACK
    # -----------------------------------
    lower_input = user_input.lower()

    if "positive" in lower_input:
        data["sentiment"] = "positive"

    elif "negative" in lower_input:
        data["sentiment"] = "negative"

    elif "neutral" in lower_input:
        data["sentiment"] = "neutral"

    # -----------------------------------
    # TIME FALLBACK
    # -----------------------------------
    if not data.get("time"):

        time_match = re.search(
            r'(\d{1,2}\s?(AM|PM|am|pm))',
            user_input
        )

        if time_match:

            extracted_time = time_match.group(1)

            extracted_time = extracted_time.upper()

            data["time"] = extracted_time

        else:

            data["time"] = datetime.now().strftime("%I:%M %p")

    # -----------------------------------
    # DATE FALLBACK
    # -----------------------------------
    if not data.get("date"):

        data["date"] = datetime.now().strftime("%Y-%m-%d")

    # -----------------------------------
    # DATABASE SAVE
    # -----------------------------------
    new_interaction = models.Interaction(
        hcp_name=data.get("hcp_name"),
        date=datetime.utcnow(),
        summary=data.get("summary"),
        key_points=data.get("key_points"),
        next_action=data.get("next_action")
    )

    db.add(new_interaction)
    db.commit()

    return {
        "message": "Logged via AI",
        "data": data
    }


# -----------------------------------
# EDIT INTERACTION TOOL
# -----------------------------------
def edit_interaction_tool(user_input: str):

    updated_data = {}

    lower_input = user_input.lower()

    # -----------------------------------
    # SENTIMENT DETECTION
    # -----------------------------------
    if "negative" in lower_input:
        updated_data["sentiment"] = "negative"

    elif "positive" in lower_input:
        updated_data["sentiment"] = "positive"

    elif "neutral" in lower_input:
        updated_data["sentiment"] = "neutral"

    # -----------------------------------
    # DOCTOR NAME DETECTION
    # -----------------------------------
    doctor_match = re.search(
        r'dr\.?\s+[a-zA-Z]+',
        user_input,
        re.IGNORECASE
    )

    if doctor_match:
        updated_data["hcp_name"] = doctor_match.group(0)

    # -----------------------------------
    # NEXT ACTION DETECTION
    # -----------------------------------
    if "follow-up" in lower_input or "follow up" in lower_input:

        updated_data["next_action"] = user_input

    return {
        "message": "Interaction updated successfully",
        "data": updated_data
    }


# -----------------------------------
# SHOW TOOL
# -----------------------------------
def get_interactions_tool(db: Session):

    interactions = db.query(models.Interaction).all()

    formatted_data = []

    for item in interactions:

        formatted_data.append({
            "hcp_name": item.hcp_name,
            "date": str(item.date),
            "summary": item.summary,
            "key_points": item.key_points,
            "next_action": item.next_action
        })

    return {
        "message": "All interactions fetched",
        "data": formatted_data
    }


# -----------------------------------
# SUGGEST TOOL
# -----------------------------------
def suggest_next_action_tool(summary: str):

    prompt = f"""
Suggest next professional action
for this medical interaction:

{summary}
"""

    suggestion = generate_response(prompt)

    return {
        "message": "Suggestion generated",
        "data": {
            "next_action": suggestion
        }
    }


# -----------------------------------
# MAIN ROUTER
# -----------------------------------
def agent_router(user_input: str, db: Session):

    user_input_lower = user_input.lower()

    # -----------------------------------
    # EDIT FLOW
    # -----------------------------------
    if (
        "change" in user_input_lower or
        "edit" in user_input_lower or
        "update" in user_input_lower or
        "actually" in user_input_lower
    ):

        return edit_interaction_tool(user_input)

    # -----------------------------------
    # SHOW FLOW
    # -----------------------------------
    elif "show" in user_input_lower:

        return get_interactions_tool(db)

    # -----------------------------------
    # SUGGEST FLOW
    # -----------------------------------
    elif "suggest" in user_input_lower:

        return suggest_next_action_tool(user_input)

    # -----------------------------------
    # LOG FLOW
    # -----------------------------------
    else:

        return log_interaction_tool(user_input, db)