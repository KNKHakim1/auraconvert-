"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

export function PdfToJpgTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  const [quality, setQuality] = useState<number>(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pdfJsRef = useRef<any>(null);

  useEffect(() => {
    const initPdfJs = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        pdfJsRef.current = pdfjsLib;
      } catch (err) {
        console.error("Failed to load PDF library", err);
      }
    };
    initPdfJs();
  }, []);

  const validateMagicBytes = async (f: File): Promise<boolean> => {
    try {
      const buffer = await f.slice(0, 4).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
    } catch {
      return false;
    }
  };

  const generateThumbnails = async (buffer: Uint8Array, pagesCount: number) => {
    if (!pdfJsRef.current) return;
    try {
      const pdf = await pdfJsRef.current.getDocument({ data: buffer }).promise;
      const thumbs: string[] = [];
      const limit = Math.min(pagesCount, 100); // UI performance limit
      
      for (let i = 1; i <= limit; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL("image/jpeg", 0.7));
      }
      setThumbnails(thumbs);
    } catch (err) {
      console.error("Thumbnail generation error:", err);
    }
  };

  const handleFileSelect = async (files: File[]) => {
    setError(null);
    setSuccess(false);
    if (files.length === 0) return;
    const f = files[0];
    
    const isValid = await validateMagicBytes(f);
    if (!isValid || !f.name.toLowerCase().endsWith(".pdf")) {
      setError(t("tools.pdf-to-jpg.invalidFile"));
      return;
    }

    try {
      const buf = await f.arrayBuffer();
      const uint8 = new Uint8Array(buf);
      setFileBuffer(uint8);
      
      if (!pdfJsRef.current) throw new Error("Library not loaded");
      const pdf = await pdfJsRef.current.getDocument({ data: uint8 }).promise;
      const pages = pdf.numPages;
      
      setFile(f);
      setNumPages(pages);
      
      const newSet = new Set<number>();
      for (let i = 1; i <= pages; i++) newSet.add(i);
      setSelectedPages(newSet);
      
      generateThumbnails(uint8, pages);
    } catch (err) {
      console.error(err);
      setError(t("tools.pdf-to-jpg.invalidFile"));
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileBuffer(null);
    setNumPages(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setError(null);
    setSuccess(false);
  };

  const togglePage = (pageNumber: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageNumber)) {
      newSet.delete(pageNumber);
    } else {
      newSet.add(pageNumber);
    }
    setSelectedPages(newSet);
  };

  const selectAll = () => {
    const newSet = new Set<number>();
    for (let i = 1; i <= numPages; i++) newSet.add(i);
    setSelectedPages(newSet);
  };

  const deselectAll = () => {
    setSelectedPages(new Set());
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    if (!fileBuffer || selectedPages.size === 0 || !pdfJsRef.current) {
      setError(t("tools.pdf-to-jpg.errorEmpty"));
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const pdf = await pdfJsRef.current.getDocument({ data: fileBuffer }).promise;
      const pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b);

      for (const pageNum of pagesToExtract) {
        const page = await pdf.getPage(pageNum);
        // Scale 2 provides good high-quality output (~2x standard resolution)
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Draw white background (PDFs are often transparent)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        
        downloadDataUrl(dataUrl, `auraconvert-page-${pageNum}.jpg`);
        
        // Small delay to prevent browser blocking multiple downloads
        await new Promise(r => setTimeout(r, 400));
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Error exporting JPGs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.pdf-to-jpg.securityNotice")}</p>
      </div>

      {!file && (
        <div className="space-y-4">
          <Dropzone
            onFileSelect={(f) => handleFileSelect([f])}
            accept=".pdf,application/pdf"
            multiple={false}
            label={t("tools.pdf-to-jpg.uploadTitle")}
            description={t("tools.pdf-to-jpg.uploadFormats")}
          />
          {error && (
            <p className="text-sm text-destructive font-semibold flex items-center justify-center gap-2">
              <Icon name="info" className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>
      )}

      {file && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/30 border border-border p-4 rounded-xl gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <Icon name="file-text" className="w-8 h-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{t("tools.pdf-to-jpg.pageCount", { count: numPages })}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors border border-destructive/20 shrink-0"
            >
              {t("tools.pdf-to-jpg.clearBtn")}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Controls Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="settings" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-to-jpg.pageSelection")}
                </h3>
                
                <div className="flex gap-2">
                  <button onClick={selectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-to-jpg.selectAll")}
                  </button>
                  <button onClick={deselectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-to-jpg.deselectAll")}
                  </button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="image" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-to-jpg.qualityLabel")}
                </h3>
                
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>Low</span>
                    <span>{(quality * 100).toFixed(0)}%</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleExport}
                  disabled={isProcessing || selectedPages.size === 0}
                  className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Icon name="refresh" className="w-4 h-4 animate-spin" />
                      {t("tools.pdf-to-jpg.processing")}
                    </>
                  ) : (
                    <>
                      <Icon name="download" className="w-4 h-4" />
                      {t("tools.pdf-to-jpg.exportBtn")} ({selectedPages.size})
                    </>
                  )}
                </button>
                
                {error && <p className="text-xs text-destructive text-center font-semibold">{error}</p>}
                {success && <p className="text-xs text-green-500 text-center font-semibold">{t("tools.pdf-to-jpg.downloadSuccess")}</p>}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-3 bg-background border border-border rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: numPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isSelected = selectedPages.has(pageNum);
                  const thumb = thumbnails[idx];

                  return (
                    <div 
                      key={pageNum}
                      onClick={() => togglePage(pageNum)}
                      className="relative flex flex-col items-center gap-2 cursor-pointer group select-none"
                    >
                      <div className={cn(
                        "w-full aspect-[1/1.4] rounded-lg border-2 overflow-hidden transition-all duration-200 relative bg-white flex items-center justify-center",
                        isSelected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                      )}>
                        {thumb ? (
                          <img src={thumb} alt={`Page ${pageNum}`} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <Icon name="file-text" className="w-8 h-8 text-muted-foreground/30" />
                        )}
                        
                        <div className={cn(
                          "absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center transition-all",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-black/20 text-transparent opacity-0 group-hover:opacity-100 border border-white/50"
                        )}>
                          <Icon name="check" className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}>
                        {pageNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
