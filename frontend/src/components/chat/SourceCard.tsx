import { FileText, ExternalLink } from "lucide-react"

export interface Source {
  id: string
  documentName: string
  page?: number
  excerpt?: string
  score?: number
  type?: "document" | "memory"
}

interface SourceCardProps {
  source: Source
  onClick?: (source: Source) => void
}

export default function SourceCard({
  source,
  onClick,
}: SourceCardProps) {
  const relevance = source.score
    ? Math.round(source.score * 100)
    : undefined

  return (
    <button
      type="button"
      onClick={() => onClick?.(source)}
      className="w-full text-left rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition p-4 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3 min-w-0">

          {/* Icon */}
          <div className="h-9 w-9 shrink-0 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">
            <FileText
              size={16}
              className="text-zinc-400"
            />
          </div>

          {/* Document information */}
          <div className="min-w-0">

            <p className="text-sm text-zinc-200 truncate">
              {source.documentName}
            </p>

            {source.page !== undefined && (
              <p className="text-xs text-zinc-500 mt-1">
                Page {source.page}
              </p>
            )}

          </div>

        </div>


        {/* Open icon */}
        <ExternalLink
          size={15}
          className="text-zinc-600 group-hover:text-zinc-300 transition shrink-0"
        />

      </div>


      {/* Excerpt */}
      {source.excerpt && (
        <p className="mt-3 text-xs leading-5 text-zinc-500 line-clamp-3">
          "{source.excerpt}"
        </p>
      )}


      {/* Bottom metadata */}
      <div className="mt-3 flex items-center justify-between">

        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
          {source.type === "memory"
            ? "Memory"
            : "Document"}
        </span>


        {relevance !== undefined && (
          <span className="text-[10px] text-zinc-600">
            {relevance}% relevance
          </span>
        )}

      </div>

    </button>
  )
}
