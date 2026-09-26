from pdf_reader import extract_text_from_pdf


pdf_path = "data/test.pdf"
text = extract_text_from_pdf(pdf_path)


def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunk = text[start:end]
        chunks.append(chunk)

        start = end - overlap

    return chunks

chunks = chunk_text(text)

print("Total chunks:", len(chunks))

print("\n--- FIRST CHUNK ---")
print(chunks[0])