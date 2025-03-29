'use client'
import PDFAnnotator from "@/components/pdf-annotator"
import dynamic from "next/dynamic";
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
const Worker = dynamic(() => import("@react-pdf-viewer/core").then(mod => mod.Worker), { ssr: false });


export default function Home() {

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">PDF Annotation Tool</h1>
      <PDFAnnotator />
    </main>
    </Worker>
  )
}