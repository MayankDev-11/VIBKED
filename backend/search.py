import chromadb

from backend.embeddings import create_embedding

# Connect to existing ChromaDB database
client = chromadb.PersistentClient(path="data/chroma_db")

# Open existing collection
collection = client.get_collection(name="vault_documents")


def search_documents(query, n_results=3):
    # Convert the question into an embedding
    query_embedding = create_embedding(query)

    # Search for similar chunks
    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)

    return results
