from pathlib import Path
import hashlib
import json

from backend.vector_store import ingest_file, delete_file


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".xlsx",
    ".txt",
    ".md",
    ".csv",
    ".json",
}

data_folder = Path("data")
state_file = data_folder / ".ingestion_state.json"


def get_file_hash(file_path):
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while chunk := file.read(1024 * 1024):
            sha256.update(chunk)

    return sha256.hexdigest()


if state_file.exists():
    with open(state_file, "r", encoding="utf-8") as file:
        ingestion_state = json.load(file)
else:
    ingestion_state = {}


for file_path in data_folder.iterdir():

    if not file_path.is_file():
        continue

    if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        continue

    file_name = file_path.name
    current_hash = get_file_hash(file_path)
    previous_hash = ingestion_state.get(file_name)

    # File has not changed
    if previous_hash == current_hash:
        print(f"Skipping unchanged file: {file_name}")
        continue

    print(f"\nProcessing: {file_name}")

    try:
        # Remove old chunks if this file was previously ingested
        if previous_hash is not None:
            delete_file(file_name)

        chunks = ingest_file(str(file_path))

        ingestion_state[file_name] = current_hash

        print(f"Stored chunks: {chunks}")

    except Exception as error:
        print(f"Failed: {error}")


with open(state_file, "w", encoding="utf-8") as file:
    json.dump(ingestion_state, file, indent=2)