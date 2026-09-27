from pathlib import Path

from backend.vector_store import ingest_file

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".txt", ".md", ".csv", ".json"}


data_folder = Path("data")


for file_path in data_folder.iterdir():
    if not file_path.is_file():
        continue

    if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        continue

    print(f"\nProcessing: {file_path.name}")

    try:
        chunks = ingest_file(str(file_path))

        print(f"Stored chunks: {chunks}")

    except Exception as error:
        print(f"Failed: {error}")
