import chromadb

from backend.chunker import chunk_documents
from backend.document_loader import load_document
from backend.embeddings import create_embedding

client = chromadb.PersistentClient(path="data/chroma_db")

collection = client.get_or_create_collection(name="vault_documents")


def ingest_file(file_path):

    documents = load_document(file_path)

    chunks = chunk_documents(documents)

    for i, chunk in enumerate(chunks):
        embedding = create_embedding(chunk["text"])

        metadata = chunk["metadata"]

        collection.upsert(
            ids=[f"{file_path}_{i}"],
            embeddings=[embedding],
            documents=[chunk["text"]],
            metadatas=[metadata],
        )

    return len(chunks)
