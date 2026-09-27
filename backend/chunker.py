def chunk_documents(documents, chunk_size=500, overlap=50):
    chunks = []

    for document in documents:
        text = document["text"]

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk = {
                "text": text[start:end],
                "metadata": {
                    key: value for key, value in document.items() if key != "text"
                },
            }

            chunks.append(chunk)

            start = end - overlap

    return chunks
