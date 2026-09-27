import chromadb

from backend.embeddings import create_embedding

client = chromadb.PersistentClient(path="data/chroma_db")

collection = client.get_collection(name="vault_documents")


def search_documents(query, n_results=5, relevance_ratio=1.6):

    query_embedding = create_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    distances = results["distances"][0]

    if not distances:
        return results

    best_distance = distances[0]

    max_distance = best_distance * relevance_ratio

    filtered_documents = []
    filtered_metadatas = []
    filtered_distances = []

    for document, metadata, distance in zip(
        results["documents"][0], results["metadatas"][0], distances
    ):
        if distance <= max_distance:
            filtered_documents.append(document)
            filtered_metadatas.append(metadata)
            filtered_distances.append(distance)

    results["documents"][0] = filtered_documents
    results["metadatas"][0] = filtered_metadatas
    results["distances"][0] = filtered_distances

    return results
