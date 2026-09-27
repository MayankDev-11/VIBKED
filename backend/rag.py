import json
import urllib.request

from backend.search import search_documents


def ask_qwen(question, context="", mode="hybrid"):

    url = "http://localhost:11434/api/chat"

    if mode == "document":
        prompt = f"""
You are VAULT, a private document assistant.

Answer the user's question using ONLY the provided document context.

If the answer is not present in the document, clearly say:
"I could not find this information in the document."

Do not use your general knowledge.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}
"""

    elif mode == "general":
        prompt = f"""
You are VAULT, a helpful AI assistant.

Answer the user's question using your existing general knowledge.

Do not use or mention any uploaded document.

USER QUESTION:
{question}
"""

    else:  # hybrid
        prompt = f"""
You are VAULT, a private AI knowledge assistant.

Answer the user's question by combining:
1. Information retrieved from the user's document.
2. Your existing general knowledge.

Use the document as the primary source when relevant.
You may add useful information from your general knowledge.

Do not claim that general knowledge came from the document.
Do not invent information about the document.

Give one natural, well-explained answer.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}
"""

    data = {
        "model": "qwen3:8b",
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))

    return result["message"]["content"]


def answer_question(question, mode="hybrid"):

    context = ""
    sources = []

    if mode in ["document", "hybrid"]:
        results = search_documents(question, n_results=3)

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]

        context_parts = []
        seen_sources = set()

        for document, metadata in zip(documents, metadatas):
            source = metadata.get("source", "Unknown source")

            if "page" in metadata:
                location = f"Page {metadata['page']}"

            elif "sheet" in metadata:
                location = f"Sheet {metadata['sheet']}"

            elif "slide" in metadata:
                location = f"Slide {metadata['slide']}"

            else:
                location = ""

            if location:
                source_label = f"{source} — {location}"
            else:
                source_label = source

            context_parts.append(f"[SOURCE: {source_label}]\n{document}")

            if source_label not in seen_sources:
                sources.append(source_label)
                seen_sources.add(source_label)

        context = "\n\n---\n\n".join(context_parts)

    answer = ask_qwen(question=question, context=context, mode=mode)

    return answer, sources


# Test
if __name__ == "__main__":
    question = "What is Search Engine Optimization?"

    answer, sources = answer_question(question, mode="document")

    print("\n--- VAULT ANSWER ---")
    print(answer)

    print("\n--- SOURCES ---")

    for source in sources:
        print(f"• {source}")
