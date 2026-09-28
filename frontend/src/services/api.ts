const API_BASE_URL = "http://localhost:8000"

export type ChatMode =
  | "document"
  | "hybrid"
  | "general"

export interface ChatSource {
  id: string
  documentName: string
  page?: number
  excerpt?: string
  score?: number
  type?: "document" | "memory"
}

export interface ChatResponse {
  answer: string
  sources: ChatSource[]
}

export async function sendChat(
  question: string,
  mode: ChatMode
): Promise<ChatResponse> {

  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        mode,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status}`
    )
  }

  return response.json()
}
