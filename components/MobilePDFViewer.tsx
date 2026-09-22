'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';

// Configure the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MobilePDFViewerProps {
  url: string;
}

export default function MobilePDFViewer({ url }: MobilePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-full overflow-hidden">
      <div className="w-full overflow-auto flex justify-center bg-slate-200 p-2 rounded-lg min-h-[500px]">
        {loading && (
          <div className="absolute flex flex-col items-center justify-center mt-20">
             <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
             <p className="text-sm text-slate-500">Renderizando PDF...</p>
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
          className="max-w-full flex flex-col gap-4"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={Math.min(window.innerWidth - 32, 600)} // Responsive width
              className="shadow-md"
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          ))}
        </Document>
      </div>
      
      {numPages > 1 && (
        <div className="mt-4 text-sm text-slate-500">
          Página {pageNumber} de {numPages}
        </div>
      )}
    </div>
  );
}
