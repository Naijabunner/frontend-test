"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Highlighter, Underline, MessageSquare, Edit3, Download, Trash2 } from 'lucide-react'

interface ColorOption {
  value: string
  label: string
}

const colorOptions: ColorOption[] = [
  { value: "#FFFF00", label: "Yellow" },
  { value: "#FF9900", label: "Orange" },
  { value: "#FF0000", label: "Red" },
  { value: "#00FF00", label: "Green" },
  { value: "#00FFFF", label: "Cyan" },
  { value: "#0000FF", label: "Blue" },
]

interface AnnotationToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  currentColor: string
  onColorChange: (color: string) => void
  onClear: () => void
  onExport: () => void
  onAddComment: () => void
}

export default function AnnotationToolbar({
  currentTool,
  onToolChange,
  currentColor,
  onColorChange,
  onClear,
  onExport,
  onAddComment,
}: AnnotationToolbarProps) {
  return (
    <div className="flex lg:flex-col gap-2 p-2 border rounded-lg bg-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={currentTool === "highlight" ? "default" : "outline"}
              size="icon"
              onClick={() => onToolChange("highlight")}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Highlight Text</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={currentTool === "underline" ? "default" : "outline"}
              size="icon"
              onClick={() => onToolChange("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline Text</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={currentTool === "comment" ? "default" : "outline"} size="icon" 
            onClick={() => onToolChange("comment")}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Comment</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={currentTool === "signature" ? "default" : "outline"}
              size="icon"
              onClick={() => onToolChange("signature")}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Right click a position in the document for the signature</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Color picker */}
      {(currentTool === "highlight" || currentTool === "underline") && (
        <div className="flex lg:flex-col gap-1 mt-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`w-6 h-6 rounded-full ${currentColor === color.value ? "ring-2 ring-primary" : ""}`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.label}
            />
          ))}
        </div>
      )}

      <div className="mt-auto flex lg:flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear All Annotations</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="icon" onClick={onExport}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export PDF</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}