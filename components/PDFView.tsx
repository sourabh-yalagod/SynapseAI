"use client";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Download,
  Loader2Icon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { handleDownload } from "@/lib/handleDownload";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFView = ({ url, name = "Untitled" }: { url: string; name: string }) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!url) return;

    const fetchPDF = async () => {
      try {
        const response = await fetch(url);
        const blobResponse = await response.blob();
        setFile(blobResponse);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPDF();
  }, [url]);
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPage(numPages);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky max-w-6xl top-0 z-50 dark:bg-gray-600 p-2 rounded-b-lg">
        <div className="px-2 flex gap-3 z-100">
          <Button
            disabled={pageNumber == 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            <ArrowBigLeft />
          </Button>
          <Button
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            <ArrowBigRight />
          </Button>
          {pageNumber} of {totalPages}
          <Button
            disabled={scale > 1.5}
            onClick={() => setScale((prev) => prev * 1.1)}
          >
            <ZoomIn className="hover:scale-105 hover:bg-blue-600 transition-all" />
          </Button>
          <Button
            disabled={scale < 0.5}
            onClick={() => setScale((prev) => prev * 0.9)}
          >
            <ZoomOut className="hover:scale-105 hover:bg-blue-600 transition-all" />
          </Button>
          <Button onClick={() => handleDownload(url, name)}>
            <Download className="hover:scale-105 hover:bg-blue-600 transition-all" />
          </Button>
        </div>
      </div>
      {!file ? (
        <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
      ) : (
        <div className="mx-auto underline underline-offset-4">
          <h1 className="text-xl font-semibold">{name}</h1>
          <Document
            loading={null}
            file={file}
            rotate={rotation}
            onLoadSuccess={onLoadSuccess}
            className="m-4 overflow-scroll"
          >
            <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFView;
