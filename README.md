# AI-First CRM HCP Module

## Overview
This project is an AI-powered CRM system for Healthcare Professional (HCP) interaction logging.

The system allows field representatives to log interactions using natural language through an AI assistant.

The AI automatically extracts:
- HCP name
- Date & time
- Summary
- Sentiment
- Key points
- Next action

The form is fully AI-driven using LangGraph and LLM-based tool routing.

---

## Tech Stack

### Frontend
- React.js
- Axios
- Modern AI Chat UI

### Backend
- FastAPI
- LangGraph
- SQLAlchemy
- Groq LLM (gemma2-9b-it)

### Database
- PostgreSQL / MySQL

---

## LangGraph Tools

### 1. Log Interaction Tool
Extracts structured CRM interaction data using LLM.

### 2. Edit Interaction Tool
Updates only specific interaction fields using conversational prompts.

### 3. Show Interaction Tool
Fetches all stored interactions from the database.

### 4. Suggest Next Action Tool
Generates AI-powered follow-up recommendations.

### 5. Agent Router Tool
Routes user intent dynamically using LangGraph.

---

## Features
- AI-first CRM workflow
- Conversational interaction logging
- Continuous AI chat
- Auto-populated forms
- Smart interaction editing
- Sentiment analysis
- Modern CRM UI

---

## Run Frontend

```bash
cd frontend
npm install
npm start