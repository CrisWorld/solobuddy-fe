"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { decodeHtml } from "@/lib/utils"

export default function TourDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="text-sm text-muted-foreground mb-3 relative">
      <div
        className={expanded ? "" : "line-clamp-2"}
        dangerouslySetInnerHTML={{ __html: decodeHtml(description) }}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute bottom-0 right-0 "
        aria-label={expanded ? "Thu gọn" : "Xem thêm"}
      >
        {expanded ? (
          <ChevronUp size={14} className="text-muted-foreground hover:text-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  )
}
