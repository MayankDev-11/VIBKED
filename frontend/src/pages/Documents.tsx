import { useRef, useState } from "react"
import {
  CheckCircle2,
  File,
  FileText,
  FolderOpen,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react"

interface DocumentItem {
  id: number
  name: string
  type: string
  size: string
  chunks: number
  status: "indexed" | "processing"
}

export default function Documents() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      name: "second.pdf",
      type: "PDF",
      size: "2.4 MB",
      chunks: 10,
      status: "indexed",
    },
    {
      id: 2,
      name: "anything.pdf",
      type: "PDF",
      size: "1.8 MB",
      chunks: 12,
      status: "indexed",
    },
    {
      id: 3,
      name: "test.md",
      type: "Markdown",
      size: "4 KB",
      chunks: 1,
      status: "indexed",
    },
  ])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newDocuments: DocumentItem[] = Array.from(files).map(
      (file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        chunks: 0,
        status: "processing",
      }),
    )

    setDocuments((current) => [
      ...current,
      ...newDocuments,
    ])

    /*
     * Temporary mock indexing.
     *
     * Later this will be replaced with:
     *
     * Frontend
     *    ↓
     * FastAPI /upload
     *    ↓
     * document_loader
     *    ↓
     * chunker
     *    ↓
     * embeddings
     *    ↓
     * ChromaDB
     */
    setTimeout(() => {
      setDocuments((current) =>
        current.map((document) =>
          newDocuments.some(
            (newDocument) =>
              newDocument.id === document.id,
          )
            ? {
                ...document,
                chunks: Math.floor(Math.random() * 12) + 1,
                status: "indexed",
              }
            : document,
        ),
      )
    }, 1800)
  }

  const getFileType = (fileName: string) => {
    const extension =
      fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return "PDF"

      case "md":
        return "Markdown"

      case "txt":
        return "Text"

      case "docx":
        return "Word"

      case "csv":
        return "CSV"

      case "json":
        return "JSON"

      default:
        return "File"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const removeDocument = (id: number) => {
    setDocuments((current) =>
      current.filter(
        (document) => document.id !== id,
      ),
    )
  }

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    setIsDragging(false)

    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="h-screen flex flex-col">

      {/* Header */}

      <header className="h-16 border-b border-white/10 flex items-center px-8 shrink-0">
        <div>
          <h1 className="text-sm font-medium">
            Documents
          </h1>

          <p className="text-xs text-zinc-500">
            Manage your private knowledge base
          </p>
        </div>
      </header>


      {/* Main */}

      <main className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Upload section */}

          <div className="mb-10">

            <div
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => {
                setIsDragging(false)
              }}
              onDrop={handleDrop}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className={`
                relative
                rounded-2xl
                border
                border-dashed
                p-10
                text-center
                cursor-pointer
                transition
                ${
                  isDragging
                    ? "border-white/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }
              `}
            >

              <div className="flex justify-center mb-5">

                <div className="h-14 w-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center">

                  <Upload
                    size={24}
                    className="text-zinc-300"
                  />

                </div>

              </div>


              <h2 className="text-base font-medium text-zinc-200">
                Drop files here
              </h2>


              <p className="text-sm text-zinc-500 mt-2">
                or click to browse your computer
              </p>


              <p className="text-xs text-zinc-600 mt-4">
                PDF · Markdown · TXT · DOCX · CSV · JSON
              </p>


              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.md,.txt,.docx,.csv,.json"
                className="hidden"
                onChange={(event) => {
                  handleFiles(event.target.files)

                  event.target.value = ""
                }}
              />

            </div>

          </div>


          {/* Knowledge base heading */}

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-sm font-medium text-zinc-200">
                Indexed Documents
              </h2>

              <p className="text-xs text-zinc-600 mt-1">
                {documents.length} documents in your local VIBKED
              </p>

            </div>


            <div className="flex items-center gap-2 text-xs text-zinc-500">

              <CheckCircle2 size={14} />

              Local storage

            </div>

          </div>


          {/* Document list */}

          <div className="space-y-2">

            {documents.length === 0 ? (

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center">

                <FolderOpen
                  size={28}
                  className="mx-auto text-zinc-600"
                />

                <p className="text-sm text-zinc-500 mt-3">
                  No documents yet
                </p>

                <p className="text-xs text-zinc-700 mt-1">
                  Upload a file to start building your VIBKED.
                </p>

              </div>

            ) : (

              documents.map((document) => (

                <div
                  key={document.id}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition p-4"
                >

                  {/* File icon */}

                  <div className="h-10 w-10 shrink-0 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">

                    {document.type === "PDF" ? (
                      <FileText
                        size={18}
                        className="text-zinc-400"
                      />
                    ) : (
                      <File
                        size={18}
                        className="text-zinc-400"
                      />
                    )}

                  </div>


                  {/* File info */}

                  <div className="flex-1 min-w-0">

                    <p className="text-sm text-zinc-200 truncate">
                      {document.name}
                    </p>

                    <div className="flex items-center gap-2 mt-1">

                      <span className="text-xs text-zinc-600">
                        {document.type}
                      </span>

                      <span className="text-zinc-700">
                        ·
                      </span>

                      <span className="text-xs text-zinc-600">
                        {document.size}
                      </span>

                    </div>

                  </div>


                  {/* Chunks */}

                  <div className="hidden sm:block text-right">

                    {document.status === "indexed" ? (

                      <>
                        <p className="text-xs text-zinc-400">
                          {document.chunks} chunks
                        </p>

                        <p className="text-[10px] text-zinc-600 mt-1">
                          Indexed
                        </p>
                      </>

                    ) : (

                      <div className="flex items-center gap-2 text-xs text-zinc-500">

                        <Loader2
                          size={13}
                          className="animate-spin"
                        />

                        Indexing...

                      </div>

                    )}

                  </div>


                  {/* Status */}

                  <div className="flex items-center">

                    {document.status === "indexed" && (
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center">

                        <CheckCircle2
                          size={15}
                          className="text-zinc-500"
                        />

                      </div>
                    )}


                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        removeDocument(document.id)
                      }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-700 hover:text-zinc-300 hover:bg-white/[0.05] transition opacity-0 group-hover:opacity-100"
                      title="Remove document"
                    >

                      <Trash2 size={14} />

                    </button>

                  </div>

                </div>

              ))

            )}

          </div>


          {/* Privacy note */}

          <div className="mt-8 flex items-center justify-center gap-2">

            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <p className="text-[11px] text-zinc-600">
              Documents are processed locally on your machine.
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}
