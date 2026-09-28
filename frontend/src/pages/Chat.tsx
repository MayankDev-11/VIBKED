import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { ArrowUp, FileText, GitBranch, Sparkles } from "lucide-react"
import SourceCard from "../components/chat/SourceCard"
import type { Source } from "../components/chat/SourceCard"
import { sendChat } from "../services/api"

type ChatMode = "document" | "hybrid" | "general"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  mode?: ChatMode
  sources?: Source[]
}

export default function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const [mode, setMode] = useState<ChatMode>("hybrid")

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Automatically scroll to the newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages, isThinking])

  const sendMessage = async () => {
    const trimmedInput = input.trim()

    if (!trimmedInput || isThinking) return

    const currentMode = mode

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
      mode: currentMode,
    }

    setMessages((current) => [...current, userMessage])
    setInput("")
    setIsThinking(true)

    try {
      // Send the question to the real FastAPI backend
      const result = await sendChat(
        trimmedInput,
        currentMode,
      )

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: result.answer,
        mode: currentMode,
        sources: result.sources ?? [],
      }

      setMessages((current) => [
        ...current,
        assistantMessage,
      ])
    } catch (error) {
      console.error("Chat request failed:", error)

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the local AI backend. Make sure FastAPI and Ollama are running.",
        mode: currentMode,
        sources: [],
      }

      setMessages((current) => [
        ...current,
        errorMessage,
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      sendMessage()
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const modes = [
    {
      id: "document" as ChatMode,
      label: "Documents",
      description: "Search your files",
      icon: FileText,
    },
    {
      id: "hybrid" as ChatMode,
      label: "Hybrid",
      description: "Files + memory",
      icon: GitBranch,
    },
    {
      id: "general" as ChatMode,
      label: "General",
      description: "Local AI only",
      icon: Sparkles,
    },
  ]

  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}

      <header className="h-16 border-b border-white/10 flex items-center px-8 shrink-0">
        <div>
          <h1 className="text-sm font-medium">
            Chat
          </h1>

          <p className="text-xs text-zinc-500">
            Ask your private knowledge base
          </p>
        </div>
      </header>


      {/* CHAT AREA */}

      <main className="flex-1 overflow-y-auto">

        {messages.length === 0 ? (

          /* EMPTY STATE */

          <div className="h-full flex items-center justify-center px-6">

            <div className="max-w-2xl w-full text-center">

              <div className="mb-8">

                <h2 className="text-4xl font-semibold tracking-tight">
                  Ask your VIBKED.
                </h2>

                <p className="mt-3 text-zinc-500">
                  Search across your documents and memories using local AI.
                </p>

              </div>


              {/* SUGGESTIONS */}

              <div className="grid grid-cols-2 gap-3 mb-6">

                <button
                  onClick={() =>
                    handleSuggestion("Summarize my documents")
                  }
                  className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
                >
                  <p className="text-sm text-zinc-200">
                    Summarize my documents
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Get the key ideas from my knowledge base
                  </p>
                </button>


                <button
                  onClick={() =>
                    handleSuggestion("What do I know about AI?")
                  }
                  className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
                >
                  <p className="text-sm text-zinc-200">
                    What do I know about AI?
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Search relevant knowledge
                  </p>
                </button>


                <button
                  onClick={() =>
                    handleSuggestion("Find my project notes")
                  }
                  className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
                >
                  <p className="text-sm text-zinc-200">
                    Find my project notes
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Search across uploaded files
                  </p>
                </button>


                <button
                  onClick={() =>
                    handleSuggestion("What does VIBKED remember?")
                  }
                  className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
                >
                  <p className="text-sm text-zinc-200">
                    What does VIBKED remember?
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Explore persistent memory
                  </p>
                </button>

              </div>

            </div>

          </div>

        ) : (

          /* MESSAGES */

          <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >

                <div className="max-w-[85%]">

                  {/* USER MODE */}

                  {message.role === "user" && message.mode && (
                    <div className="flex justify-end mb-1">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                        {message.mode}
                      </span>
                    </div>
                  )}


                  {/* MESSAGE */}

                  <div
                    className={
                      message.role === "user"
                        ? "rounded-2xl bg-white text-black px-4 py-3 text-sm"
                        : "text-zinc-200 text-sm leading-7"
                    }
                  >
                    {message.content}
                  </div>


                  {/* SOURCES */}

                  {message.role === "assistant" &&
                    message.sources &&
                    message.sources.length > 0 && (

                    <div className="mt-5">

                      <div className="flex items-center gap-2 mb-3">

                        <div className="h-px flex-1 bg-white/10" />

                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                          Sources
                        </span>

                        <div className="h-px flex-1 bg-white/10" />

                      </div>


                      <div className="space-y-2">

                        {message.sources.map((source) => (

                          <SourceCard
                            key={source.id}
                            source={source}
                          />

                        ))}

                      </div>

                    </div>
                  )}

                </div>

              </div>

            ))}


            {/* THINKING */}

            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">

                <span className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse" />

                VIBKED is thinking...

              </div>
            )}


            {/* AUTO SCROLL TARGET */}

            <div ref={chatEndRef} />

          </div>

        )}

      </main>


      {/* INPUT AREA */}

      <div className="p-6 shrink-0">

        <div className="max-w-3xl mx-auto">

          <div className="rounded-xl border border-white/10 bg-white/[0.03]">

            {/* INPUT ROW */}

            <div className="flex items-center gap-3 p-2">

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask your VIBKED..."
                disabled={isThinking}
                className="flex-1 bg-transparent px-3 py-3 outline-none text-sm text-white placeholder:text-zinc-600 disabled:opacity-50"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isThinking}
                className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={18} />
              </button>

            </div>


            {/* MODE SELECTOR */}

            <div className="px-3 pb-3">

              <div className="flex items-center gap-1 p-1 rounded-lg bg-black/30 border border-white/5">

                {modes.map((chatMode) => {

                  const Icon = chatMode.icon
                  const isActive = mode === chatMode.id

                  return (
                    <button
                      key={chatMode.id}
                      onClick={() =>
                        setMode(chatMode.id)
                      }
                      disabled={isThinking}
                      className={`
                        flex-1
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-3
                        py-2
                        rounded-md
                        transition
                        text-xs
                        ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                        }
                        disabled:opacity-40
                      `}
                    >

                      <Icon size={14} />

                      {chatMode.label}

                    </button>
                  )

                })}

              </div>


              {/* MODE DESCRIPTION */}

              <div className="flex justify-center mt-2">

                <p className="text-[10px] text-zinc-600">

                  {mode === "document" &&
                    "Answers using your indexed documents"}

                  {mode === "hybrid" &&
                    "Combines documents with persistent memory"}

                  {mode === "general" &&
                    "Answers directly using your local AI model"}

                </p>

              </div>

            </div>

          </div>


          <p className="text-[11px] text-zinc-600 text-center mt-3">
            Your knowledge stays in your local VIBKED.
          </p>

        </div>

      </div>

    </div>
  )
}
