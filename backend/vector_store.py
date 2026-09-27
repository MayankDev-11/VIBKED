import chromadb
from chunker import chunk_text
from embeddings import create_embedding
from pdf_reader import extract_text_from_pdf

# 1. Create a persistent ChromaDB database
client = chromadb.PersistentClient(path="data/chroma_db")

# 2. Create or get a collection
collection = client.get_or_create_collection(name="vault_documents")


# 3. Read PDF
pdf_path = "data/test.pdf"
text = extract_text_from_pdf(pdf_path)

# 4. Split PDF text into chunks
chunks = chunk_text(text)

print("Total chunks:", len(chunks))


# 5. Generate embeddings and store everything
for i, chunk in enumerate(chunks):
    embedding = create_embedding(chunk)

    collection.add(ids=[f"chunk_{i}"], embeddings=[embedding], documents=[chunk])

    print(f"Stored chunk {i + 1}/{len(chunks)}")


print("\nAll chunks stored in ChromaDB!")
print("Total documents in database:", collection.count())
