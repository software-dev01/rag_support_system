from google import genai
from dotenv import load_dotenv
from app.db import documents
import os
import time
from google.genai.errors import ClientError

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def create_embedding(text: str):
    """
    Create embedding using Gemini
    """

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )

    return response.embeddings[0].values


def retrieve_documents(
    question: str,
    limit: int = 5
):
    """
    Retrieve relevant chunks from MongoDB Atlas Vector Search
    """

    query_embedding = create_embedding(
        question
    )

    pipeline = [
        {
            "$vectorSearch": {
                "index": os.getenv(
                    "VECTOR_INDEX",
                    "vector_index"
                ),
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": limit
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "source": 1,
                "score": {
                    "$meta": "vectorSearchScore"
                }
            }
        }
    ]

    results = list(
        documents.aggregate(
            pipeline
        )
    )

    # Filter weak matches
    results = [
        doc
        for doc in results
        if doc.get("score", 0) >= 0.75
    ]

    print("\n========== RETRIEVED DOCS ==========")

    for doc in results:
        print(
            f"{doc['source']} | "
            f"score={round(doc['score'], 3)}"
        )

    print("====================================\n")

    return results


def build_context(
    docs: list
):
    """
    Build context for Gemini prompt
    """

    return "\n\n".join(
        doc["text"]
        for doc in docs
    )

def generate_answer(
    question: str
):
    """
    Complete RAG Pipeline
    """

    try:

        docs = retrieve_documents(
            question
        )

        if not docs:
            return {
                "answer":
                    "I could not find that information.",
                "sources": []
            }

        context = build_context(
            docs
        )

        prompt = f"""
You are a customer support assistant.

Use ONLY the provided context.

Rules:
- Never invent information.
- If the answer is not explicitly present in the context,
  respond with:

I could not find that information.

Context:
{context}

Question:
{question}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        answer = response.text.strip()

        # If Gemini cannot answer
        if (
            "could not find" in answer.lower()
            or "not found" in answer.lower()
        ):
            return {
                "answer":
                    "I could not find that information.",
                "sources": []
            }

        unique_sources = {}

        for doc in docs:

            source_name = doc["source"]

            if source_name not in unique_sources:

                unique_sources[source_name] = {
                    "document": source_name,
                    "excerpt": (
                        doc["text"][:180] + "..."
                        if len(doc["text"]) > 180
                        else doc["text"]
                    ),
                    "score": round(
                        doc["score"],
                        3
                    )
                }

        sources = list(
            unique_sources.values()
        )

        return {
            "answer": answer,
            "sources": sources
        }

    except Exception as e:

        print(
            "GENERATE ERROR:",
            str(e)
        )

        error_message = str(e)

        if (
            "RESOURCE_EXHAUSTED"
            in error_message
            or "429"
            in error_message
        ):
            return {
                "answer":
                    " Gemini API quota exceeded. Please try again later.",
                "sources": []
            }

        return {
            "answer":
                " Unable to generate a response at the moment. Please try again.",
            "sources": []
        }

def stream_answer(
    question: str
):
    """
    Stream Gemini response chunk-by-chunk
    """

    try:

        docs = retrieve_documents(
            question
        )

        if not docs:
            yield (
                "I could not find "
                "that information."
            )
            return

        context = build_context(
            docs
        )

        prompt = f"""
You are a customer support assistant.

Use ONLY the provided context.

Rules:
- Never invent information.
- If the answer is not explicitly present in the context,
  respond with:

I could not find that information.

Context:
{context}

Question:
{question}
"""

        response = (
            client.models.generate_content_stream(
                model="gemini-2.5-flash",
                contents=prompt
            )
        )

        for chunk in response:

            if not chunk.text:
                continue

            print(
                "STREAM CHUNK:",
                chunk.text
            )

            words = (
                chunk.text.split()
            )

            for word in words:

                yield word + " "

                time.sleep(0.03)

    except Exception as e:

        print(
            "STREAM ERROR:",
            str(e)
        )

        error_message = str(e)

        if (
            "RESOURCE_EXHAUSTED"
            in error_message
            or "429"
            in error_message
        ):
            yield (
                "Gemini API quota exceeded. "
                "Please try again later."
            )

        else:
            yield (
                "Unable to generate a response. "
                "Please try again."
            )

        print(
            "STREAM ERROR:",
            str(e)
        )

        error_message = str(e)

        if (
            "RESOURCE_EXHAUSTED"
            in error_message
            or "429"
            in error_message
        ):
            yield (
                "Gemini API quota exceeded. "
                "Please try again later."
            )

        else:
            yield (
                "Unable to generate a response. "
                "Please try again."
            )