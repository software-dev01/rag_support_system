from pathlib import Path
from dotenv import load_dotenv
from google import genai
from pypdf import PdfReader
from app.db import documents
import os

# Load environment variables
load_dotenv()

# Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Documents folder
DOCS_DIR = BASE_DIR / "sample-docs"


def chunk_text(
    text: str,
    chunk_size: int = 500
):
    """
    Split text into chunks
    """

    return [
        text[i:i + chunk_size]
        for i in range(
            0,
            len(text),
            chunk_size
        )
    ]


def create_embedding(
    text: str
):
    """
    Create Gemini embedding
    """

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )

    return response.embeddings[0].values


def read_document(
    file_path: Path
):
    """
    Read text from supported files
    """

    suffix = file_path.suffix.lower()

    # PDF
    if suffix == ".pdf":

        reader = PdfReader(
            str(file_path)
        )

        text = ""

        for page in reader.pages:

            page_text = (
                page.extract_text()
            )

            if page_text:
                text += (
                    page_text + "\n"
                )

        return text

    # TXT / MD
    elif suffix in [
        ".txt",
        ".md"
    ]:

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            return file.read()

    else:

        print(
            f"Skipping unsupported file: {file_path.name}"
        )

        return ""


def ingest_documents():
    """
    Read all documents
    Generate embeddings
    Store in MongoDB
    """

    if not DOCS_DIR.exists():

        raise FileNotFoundError(
            f"Directory not found: {DOCS_DIR}"
        )

    # Optional:
    # Remove old documents before re-ingesting
    documents.delete_many({})

    print(
        "Old documents removed"
    )

    total_chunks = 0

    for file_path in DOCS_DIR.iterdir():

        if not file_path.is_file():
            continue

        print(
            f"\nProcessing: {file_path.name}"
        )

        content = read_document(
            file_path
        )

        if not content.strip():

            print(
                "No content found"
            )

            continue

        chunks = chunk_text(
            content
        )

        print(
            f"Found {len(chunks)} chunks"
        )

        for chunk in chunks:

            embedding = (
                create_embedding(
                    chunk
                )
            )

            documents.insert_one({
                "text": chunk,
                "source":
                    file_path.name,
                "embedding":
                    embedding
            })

            total_chunks += 1

            print(
                f"Inserted chunk {total_chunks}"
            )

    print(
        f"\nSuccessfully ingested {total_chunks} chunks"
    )


if __name__ == "__main__":
    ingest_documents()