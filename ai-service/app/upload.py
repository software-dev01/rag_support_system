from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import shutil

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

DOCS_DIR = BASE_DIR / "sample-docs"

DOCS_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):
    destination = (
        DOCS_DIR / file.filename
    )

    with open(
        destination,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "message":
            "Document uploaded",
        "filename":
            file.filename
    }