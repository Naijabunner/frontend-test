"use client"

import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import type { Annotation, Comment } from "@/lib/types"

// Set up the PDF.js worker
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

interface PDFViewerProps {
  file: File
  pageNumber: number
  scale: number
  onLoadSuccess: ({ numPages }: { numPages: number }) => void
  annotations: Annotation[]
  currentTool: string
  currentColor: string
  onAddAnnotation: (annotation: Annotation) => void
  onAddComment: (comment: Comment) => void
}

export default function PDFViewer({
  file,
  pageNumber,
  scale,
  onLoadSuccess,
  annotations,
  currentTool,
  currentColor,
  onAddAnnotation,
  onAddComment,
}: PDFViewerProps) {
  const [selectedText, setSelectedText] = useState<string>("")
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)

  // Handle text selection
//   useEffect(() => {
//     const handleMouseUp = () => {
//       if (currentTool === "highlight" || currentTool === "underline" || currentTool === "comment") {
//         const selection = window.getSelection()
//         if (selection && selection.toString().trim() !== "") {
//           const text = selection.toString()
//           setSelectedText(text)

//           // Get position of selection
//           const range = selection.getRangeAt(0)
//           const rect = range.getBoundingClientRect()
//           setSelectionPosition({ x: rect.left, y: rect.top })

//           // Apply annotation based on current tool
//           if (currentTool === "highlight" || currentTool === "underline") {
//             onAddAnnotation({
//               type: currentTool,
//               page: pageNumber,
//               position: { x: rect.left, y: rect.top },
//               content: text,
//               color: currentColor,
//             })

//             // Clear selection after applying annotation
//             selection.removeAllRanges()
//             setSelectedText("")
//             setSelectionPosition(null)
//           }
//         }
//       }
//     }

//     document.addEventListener("mouseup", handleMouseUp)
//     return () => {
//       document.removeEventListener("mouseup", handleMouseUp)
//     }
//   }, [currentTool, currentColor, pageNumber, onAddAnnotation])

  // Handle comment creation
//   useEffect(() => {
//     if (currentTool === "comment" && selectedText && selectionPosition) {
//       const commentText = prompt("Enter your comment:")
//       if (commentText) {
//         onAddComment({
//           id: `comment-${Date.now()}`,
//           page: pageNumber,
//           position: selectionPosition,
//           content: commentText,
//           createdAt: new Date(),
//         })
//       }

//       // Clear selection
//       window.getSelection()?.removeAllRanges()
//       setSelectedText("")
//       setSelectionPosition(null)
//     }
//   }, [selectedText, selectionPosition, currentTool, pageNumber, onAddComment])

  return (
    <div className="relative">
      <Document file={file} onLoadSuccess={onLoadSuccess} className="pdf-document">
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="pdf-page"
        />
      </Document>

      {/* Render annotations */}
      <div className="absolute top-0 left-0 pointer-events-none">
        {annotations.map((annotation, index) => {
          if (annotation.type === "signature") {
            return (
              <div
                key={annotation.id || index}
                style={{
                  position: "absolute",
                  left: `${annotation.position.x}px`,
                  top: `${annotation.position.y}px`,
                  zIndex: 10,
                }}
              >
                <img src={annotation.content || "/placeholder.svg"} alt="Signature" style={{ maxWidth: "200px" }} />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}