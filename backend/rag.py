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

    # Document retrieval is needed for document and hybrid modes
    if mode in ["document", "hybrid"]:
        results = search_documents(question, n_results=3)

        documents = results["documents"][0]

        context = "\n\n---\n\n".join(documents)

    answer = ask_qwen(question=question, context=context, mode=mode)

    return answer


# Test
question = "What is Search Engine Optimization?"

answer = answer_question(question, mode="general")

print("\n--- VAULT ANSWER ---")
print(answer)
