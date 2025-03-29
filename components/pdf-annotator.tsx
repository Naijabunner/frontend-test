'use client'
import { FileUp, ZoomOut, ZoomIn, Save } from 'lucide-react'
import React, { useRef, useState } from 'react'
// import { useDropzone } from 'react-dropzone'
import AnnotationToolbar from './annotation-toolbar'
import CommentPanel from './comment-panel'
import SignatureCanvas from './signature-canvas'
import { Button } from './ui/button'
import { dropPlugin } from "@react-pdf-viewer/drop";
import { HighlightArea, highlightPlugin, MessageIcon, RenderHighlightsProps, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import { Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { getFilePlugin, RenderDownloadProps } from '@react-pdf-viewer/get-file';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/drop/lib/styles/index.css";


const MainAnnotator = () => {
    // State management
    const getFilePluginInstance = getFilePlugin();
const { Download } = getFilePluginInstance;

    // const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [currentTool, setCurrentTool] = useState<string>("none")
    const [currentColor, setCurrentColor] = useState<string>("#FFFF00")
    const [annotations, setAnnotations] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [scale, setScale] = useState<number>(1.0)
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
  const [signatures, setSignatures] = useState<{ top: number; left: number; dataUrl: string }[]>([]);

  const [contextMenu, setContextMenu] = useState<{ top: number; left: number } | null>(null);


    const pdfContainerRef = useRef<HTMLDivElement | null>(null)
    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [highlightedText, setHighlightedText] = React.useState<Note[]>([]);
    let noteId = notes.length;

    // // File upload handling with react-dropzone
    // const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //   accept: {
    //     "application/pdf": [".pdf"],
    //   },
    //   onDrop: (acceptedFiles) => {
    //     if (acceptedFiles.length > 0) {
    //       const file = acceptedFiles[0]
    //       setFile(file)
    //       // Create a URL for the file
    //       const url = URL.createObjectURL(file)
    //       setFileUrl(url)
    //       setAnnotations([])
    //       setComments([])
    //       setPageNumber(1)
    //     }
    //   },
    // })

    // PDF document load handler
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    // Tool selection handler
    const handleToolChange = (tool: string) => {
        setCurrentTool(tool)
    }

    // Color selection handler
    const handleColorChange = (color: string) => {
        setCurrentColor(color)
    }

    // Zoom control handlers
    const handleZoom = (direction: "in" | "out") => {
        if (direction === "in" && scale < 2.0) {
            setScale((prev) => prev + 0.1)
        } else if (direction === "out" && scale > 0.5) {
            setScale((prev) => prev - 0.1)
        }
    }

    // Clear all annotations
    const clearAnnotations = () => {
        setAnnotations([])
        setComments([])
    }

    // Export PDF with annotations
    const exportPDF = () => {
        //   if (fileUrl) {
        //     const link = document.createElement("a")
        //     const objectElement = document.querySelector('main');
        //     if (objectElement && objectElement.data) {
        //       link.href = objectElement;
        //     }
        //     link.download = file ? `annotated-${file.name}` : "annotated-document.pdf"
        //     link.click()

        //     alert("In a complete implementation, this would export the PDF with all annotations embedded.")
        //   }
    }

    // // Save signature and add it as an annotation
    const handleSaveSignature = (signatureData: string) => {
        //   setShowSignatureCanvas(false)

        //   // Add signature as annotation
        //   setAnnotations((prev) => [
        //     ...prev,
        //     {
        //       id: `signature-${Date.now()}`,
        //       type: "signature",
        //       content: signatureData,
        //       position: { x: 500, y: 500 },
        //       page: pageNumber,
        //       color: "black",
        //     },
        //   ])
        contextMenu &&  setSignatures([...signatures, { ...contextMenu, dataUrl: signatureData }]);
     
    }

   

    // // Add a comment
    const addComment = () => {
        //   const commentText = prompt("Enter your comment:")
        //   if (commentText) {
        //     setComments((prev) => [
        //       ...prev,
        //       {
        //         id: `comment-${Date.now()}`,
        //         content: commentText,
        //         createdAt: new Date(),
        //         page: pageNumber,
        //         position: { x: 100, y: 100 },
        //       },
        //     ])
        //   }
    }


    const handleTextHighlight = (selectedText: HighlightArea[]) => {
        setHighlightedText((prev) => [...prev, { id: Date.now(), highlightAreas: selectedText, color: currentColor }]);
    };



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    };

    //////Render Highlight TARGET
    //////Render Highlight TARGET
    //////Render Highlight TARGET
    //////Render Highlight TARGET
    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                gap: 2,
                zIndex: 1,
            }}
        >

            {currentTool === 'comment' && <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
            }
            {currentTool === 'highlight' && <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={() => {
                        handleTextHighlight(props.highlightAreas)
                        // props.toggle()
                    }}>
                        <Save />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Save highlighted text</div>}
                offset={{ left: 0, top: -8 }}
            />}
        </div>
    );



    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));
                props.cancel();
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    console.log(currentTool)


    //////Render Highlight
    //////Render Highlight
    //////Render Highlight
    //////Render Highlight
    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        // Filter all highlights on the current page
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                            />
                        ))}
                </React.Fragment>
            ))}
            {highlightedText.map((text) => (
                <React.Fragment key={text.id}>
                    {text.highlightAreas
                        // Filter all highlights on the current page
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: text.color,
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );
    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (currentTool === 'signature') {
        setContextMenu({ top: event.clientY + -45, left: event.clientX });
        }
      };



    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    })


    const dropPluginInstance = dropPlugin();

    return (
        <>
            {!fileUrl ? (
                // File upload dropzone
                <div
                    // {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${"border-muted-foreground"
                        }`}
                >
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Drag & drop a PDF here, or click to select</p>
                    <p className="text-sm text-muted-foreground mt-2">Supported file: PDF</p>
                </div>
            ) : (
                // PDF viewer and annotation interface
                <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
                    {/* Toolbar */}
                        <Download>
                            {
                                (props: RenderDownloadProps) => (
                                    <AnnotationToolbar
                                        currentTool={currentTool}
                                        onToolChange={handleToolChange}
                                        currentColor={currentColor}
                                        onColorChange={handleColorChange}
                                        onClear={clearAnnotations}
                                        onExport={props.onClick}
                                        onAddComment={addComment}
                                    />
                                )
                            }

                        </Download>
                   


                    {/* PDF Viewer */}
                    <div className="flex-1 overflow-auto border rounded-lg relative" ref={pdfContainerRef}>
                        <div className="sticky top-0 z-10 bg-background p-2 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">PDF Document</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleZoom("out")}>
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
                                <Button variant="outline" size="icon" onClick={() => handleZoom("in")}>
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <main className="flex justify-center p-4 relative "   onContextMenu={handleRightClick}>
                            {/* Simple PDF viewer using object tag */}
                            {/* <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}> */}
                            {/* <object data={fileUrl || ""} type="application/pdf" width="800" height="600" className="bordern">
                    <p>
                      Your browser does not support PDFs. <a href={fileUrl || ""}>Download the PDF</a>.
                    </p>
                  </object> */}
                            {fileUrl && <Viewer fileUrl={fileUrl} plugins={[dropPluginInstance, highlightPluginInstance, getFilePluginInstance]}  />}
                            {/* </div> */}
                            {signatures.map((sig, index) => (
            <img key={index} src={sig.dataUrl} alt="Signature" style={{ position: "absolute", top: sig.top -120 , left: sig.left - 10, width: "200px" }} />
          ))}
                            {/* Overlay for annotations
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                {annotations.map(
                                    (annotation) =>
                                        annotation.type === "signature" && (
                                            <div
                                                key={annotation.id}
                                                style={{
                                                    position: "absolute",
                                                    left: `${annotation.position.x}px`,
                                                    top: `${annotation.position.y}px`,
                                                    zIndex: 10,
                                                    transform: `scale(${scale})`,
                                                    transformOrigin: "top left",
                                                }}
                                            >
                                                <img
                                                    src={annotation.content || "/placeholder.svg"}
                                                    alt="Signature"
                                                    style={{ maxWidth: "200px" }}
                                                />
                                            </div>
                                        ),
                                )}
                            </div> */}
                        </main>
                    </div>

                    {/* Comments Panel */}
                    {comments.length > 0 && (
                        <CommentPanel
                            comments={comments}
                            onDelete={(id) => {
                                setComments((prev) => prev.filter((c) => c.id !== id))
                            }}
                        />
                    )}
                </div>
            )}

            {/* Signature Canvas Modal */}
            {currentTool === 'signature' && contextMenu  && (
                <SignatureCanvas onSave={handleSaveSignature} onCancel={() =>{ 
                    setContextMenu(null)
                }} />
            )}


        </>
    )
}
export default MainAnnotator