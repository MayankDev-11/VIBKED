import json
import urllib.request


def create_embedding(text):
    url = "http://localhost:11434/api/embed"

    data = {"model": "nomic-embed-text", "input": text}

    request = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))

    return result["embeddings"][0]
