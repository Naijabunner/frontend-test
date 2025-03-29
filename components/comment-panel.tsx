"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: Date
}

interface CommentPanelProps {
  comments: Comment[]
  onDelete: (id: string) => void
}

export default function CommentPanel({ comments, onDelete }: CommentPanelProps) {
  const [expandedComment, setExpandedComment] = useState<string | null>(null)

  return (
    <div className="w-full lg:w-64 border rounded-lg p-4 bg-background">
      <h3 className="font-medium mb-4">Comments ({comments.length})</h3>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-md p-3 bg-muted/50">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">Comment</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(comment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm mt-1 line-clamp-2">{comment.content}</p>

              {comment.content.length > 100 && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  onClick={() => setExpandedComment(expandedComment === comment.id ? null : comment.id)}
                >
                  {expandedComment === comment.id ? "Show less" : "Show more"}
                </Button>
              )}

              <p className="text-xs text-muted-foreground mt-2">{comment.createdAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}