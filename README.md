# VIBKED

### Your Private AI OS 🔐

> **An AI you actually own.**

VIBKED is a **local-first Private AI OS** that turns your documents and conversations into a private, searchable knowledge system.

Unlike cloud-based AI tools where your data is sent to external servers, VIBKED is designed to run **locally on your machine** — keeping your documents, memory, and AI interactions under your control.

---

## 🚀 What is VIBKED?

VIBKED follows a simple pipeline:

**Data → Knowledge → Memory → Reasoning → Action**

You can upload documents such as PDFs, Markdown, TXT, CSV, JSON, DOCX and other supported formats.

VIBKED processes these files locally, converts their content into searchable knowledge using embeddings, remembers useful context across conversations, and uses a local LLM to answer questions based on your data.

---

## ✨ Key Features

- 🔒 **Local-First & Private**
  - Your data stays on your machine.
  - No OpenAI API required.
  - No cloud document storage.

- 📄 **Document Intelligence**
  - Upload your own documents.
  - Automatic document processing and chunking.
  - Ask questions directly about your files.

- 🧠 **Semantic Search**
  - Documents are converted into embeddings.
  - ChromaDB stores and retrieves relevant information.
  - Finds meaning instead of relying only on exact keywords.

- 💾 **Persistent Memory**
  - Conversation context can be retained across sessions.
  - Mem0 is used for long-term memory and learned facts.

- 🤖 **Local AI Reasoning**
  - Ollama runs the local LLM.
  - The model combines retrieved knowledge with conversation context to generate answers.

- 🛠️ **Agentic Actions**
  - MCP-based tools allow VIBKED to interact with external capabilities.
  - Designed to move beyond simply answering questions.

- ⚡ **Modern Web Interface**
  - React + Vite frontend.
  - FastAPI + Python backend.
  - Clean and responsive interface.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      User Data      │
                    │ PDF • TXT • MD •    │
                    │ CSV • JSON • DOCX   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Document Loader   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Chunking       │
                    │  Split into useful  │
                    │     text chunks     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Embeddings      │
                    │  nomic-embed-text   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      ChromaDB       │
                    │  Local Vector Store │
                    └──────────┬──────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
              ┌──────────────┐   ┌──────────────┐
              │   Retrieval  │   │    Mem0      │
              │  Relevant    │   │  Persistent  │
              │  Documents   │   │    Memory    │
              └──────┬───────┘   └──────┬───────┘
                     │                   │
                     └─────────┬─────────┘
                               ▼
                    ┌─────────────────────┐
                    │     Local LLM       │
                    │       Ollama        │
                    │      Qwen3 8B       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MCP Tools     │
                    │   Actions / Tools   │
                    └─────────────────────┘
