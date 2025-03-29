'use client'
import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function page() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const sigPad = useRef(null);
  const [activeTool, setActiveTool] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentPosition, setCommentPosition] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const addAnnotation = (pageNumber, type, text = "", position = null) => {
    setAnnotations([...annotations, { page: pageNumber, type, text, position }]);
  };

  const saveSignature = () => {
    const signatureData = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
    setAnnotations([...annotations, { type: "signature", data: signatureData }]);
  };

  const handleTextSelection = (event, pageNumber) => {
    if (activeTool === "highlight" || activeTool === "underline") {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const position = { top: rect.top + window.scrollY, left: rect.left + window.scrollX, width: rect.width, height: rect.height };
        addAnnotation(pageNumber, activeTool, selection.toString(), position);
      }
    }
  };

  const handleCommentClick = (e, pageNumber) => {
    if (activeTool === "comment") {
      const position = { top: e.clientY + window.scrollY, left: e.clientX + window.scrollX };
      setCommentPosition({ page: pageNumber, position });
    }
  };

  const saveComment = () => {
    if (commentInput.trim() && commentPosition) {
      addAnnotation(commentPosition.page, "comment", commentInput, commentPosition.position);
      setCommentInput("");
      setCommentPosition(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      
      {/* Custom Toolbar */}
      <div className="toolbar">
        <button onClick={() => setActiveTool("highlight")}>Highlight</button>
        <button onClick={() => setActiveTool("underline")}>Underline</button>
        <button onClick={() => setActiveTool("comment")}>Comment</button>
        <button onClick={() => setActiveTool("signature")}>Signature</button>
      </div>
      
      {file && (
        <Document
          file={URL.createObjectURL(file)}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={index} onMouseUp={(e) => handleTextSelection(e, index + 1)} onClick={(e) => handleCommentClick(e, index + 1)} style={{ position: "relative" }}>
              <Page pageNumber={index + 1} />
              {annotations.filter(a => a.page === index + 1).map((a, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: a.position?.top,
                  left: a.position?.left,
                  width: a.position?.width,
                  height: a.position?.height,
                  backgroundColor: a.type === "highlight" ? "yellow" : "transparent",
                  borderBottom: a.type === "underline" ? "2px solid red" : "none",
                  opacity: 0.5,
                  pointerEvents: "none"
                }}>
                  {a.type === "comment" && <span style={{ backgroundColor: "white", padding: "2px", border: "1px solid black" }}>{a.text}</span>}
                </div>
              ))}
            </div>
          ))}
        </Document>
      )}
      
      {commentPosition && (
        <div style={{ position: "absolute", top: commentPosition.position.top, left: commentPosition.position.left, backgroundColor: "white", padding: "5px", border: "1px solid black" }}>
          <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Enter comment" />
          <button onClick={saveComment}>Save</button>
        </div>
      )}
      
      <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ width: 400, height: 200 }} />
      <button onClick={saveSignature}>Save Signature</button>
    </div>
  );
}
