# RAG Support Knowledge Assistant

A Retrieval-Augmented Generation (RAG) based customer support assistant that allows users to upload documents and ask questions in natural language. The system retrieves relevant information from uploaded documents and generates AI-powered answers with source citations, helping support teams quickly find accurate information without manually searching through PDFs and FAQs.

---

## Project Overview

Customer support agents often spend a significant amount of time searching through manuals, policies, FAQs, and other documentation to answer customer queries. This project addresses that problem by providing an AI-powered knowledge assistant that:

* Accepts document uploads (PDFs, manuals, FAQs, etc.)
* Indexes document content using vector embeddings
* Retrieves the most relevant content for a user's question
* Generates accurate answers using Gemini
* Displays source citations for verification
* Streams responses in real time for a better user experience

---

## Architecture

The application is built using a microservice-style architecture.

React Frontend        
Vite + TypeScript 


API Gateway             
Node.js + Express

AI Service              
FastAPI + Gemini 

MongoDB Atlas   Gemini API
Vector Search

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Real-time streaming UI

### API Gateway

* Node.js
* Express
* Acts as a communication layer between frontend and AI service
* Makes it easier to add authentication, logging, and rate limiting in the future

### AI Service

* FastAPI
* Gemini API
* MongoDB Atlas Vector Search
* Document ingestion and retrieval logic

### Database

* MongoDB Atlas
* Stores document chunks and embeddings
* Performs semantic similarity search using vector indexes

---

## Design Decisions

### Why RAG?

Large language models can hallucinate when answering questions. By using Retrieval-Augmented Generation (RAG), the model is provided with relevant information from uploaded documents before generating a response.

Benefits:

* More accurate answers
* Reduced hallucinations
* Better traceability
* Source citations for verification

### Why MongoDB Atlas Vector Search?

MongoDB Atlas provides native vector search capabilities and integrates well with document-based storage.

Benefits:

* Easy setup
* Scalable
* Native vector indexing
* Good fit for document retrieval

### Why FastAPI?

FastAPI was chosen for the AI service because it offers:

* Excellent performance
* Async support
* Streaming support
* Clean API development experience

### Why Node.js API Gateway?

The API Gateway provides a clear separation between the frontend and AI service.

Benefits:

* Better maintainability
* Easier scaling
* Future authentication support
* Centralized request handling

### Why Streaming Responses?

Instead of waiting for the entire response to be generated, answers are streamed word-by-word to the frontend.

Benefits:

* Better user experience
* Reduced perceived latency
* More conversational feel

---

## Features

* Document Upload
* PDF Knowledge Base
* RAG-based Retrieval
* Gemini-powered Responses
* Source Citations
* Real-time Streaming
* MongoDB Atlas Vector Search
* Responsive UI
* Modern shadcn/ui Design

---

# Local Setup

## Prerequisites

Make sure the following are installed:

* Node.js 20+
* Python 3.11+
* MongoDB Atlas Account
* Google Gemini API Key
* Git

---

## Clone Repository

git clone https://github.com/software-dev01/rag_support_system.git

cd rag-support-system


---

# AI Service Setup

Navigate to the AI service:
cd ai-service


## macOS 

Create virtual environment:
python3 -m venv venv


Activate virtual environment:
source venv/bin/activate


Install dependencies:
pip install -r requirements.txt


Start the service:
uvicorn app.main:app --reload


---

## Windows

(Optional) Remove existing virtual environment:
rmdir /s /q venv


Create virtual environment:
py -m venv venv


Verify Scripts folder:
dir venv\Scripts


Activate virtual environment:
venv\Scripts\activate


Install dependencies:
py -m pip install -r requirements.txt


Run the service:
uvicorn app.main:app --reload


---

Create a `.env` file inside `ai-service`:
MONGODB_URI=your_mongodb_connection_string
DB_NAME=rag_support
COLLECTION_NAME=documents
VECTOR_INDEX=vector_index
GEMINI_API_KEY=your_gemini_api_key


The AI service will run on:
http://localhost:8000


---

# API Gateway Setup

Navigate to:
cd api-gateway


Install dependencies:
npm install


Create a `.env` file:
AI_SERVICE_URL=http://localhost:8000
PORT=5000


Start the gateway:
npm run dev


The API Gateway will run on:
http://localhost:5000


---

# Frontend Setup

Navigate to:
cd frontend


Install dependencies:
npm install


Create a `.env` file:
VITE_API_URL=http://localhost:5000/api


Start the frontend:
npm run dev


The frontend will run on:
http://localhost:5173


---

# Running the Application

Start services in the following order:

1. MongoDB Atlas (ensure connection is active)
2. AI Service
3. API Gateway
4. Frontend

Open:
http://localhost:5173


Upload a document and start asking questions.

---

# Example Questions

* What is the refund policy?
* How do I reset my password?
* What technologies are mentioned in the uploaded document?
* What are the support hours?
* Summarize this document.

---

# Deployment

## Frontend

Deploy to:

* Vercel

## API Gateway

Deploy to:

* Render

## AI Service

Deploy to:

* Render

## Database

Use:

* MongoDB Atlas

---

# Author

Developed as part of a RAG-based Customer Support Knowledge Assistant project demonstrating modern AI application architecture using React, Node.js, FastAPI, MongoDB Atlas, and Gemini.
