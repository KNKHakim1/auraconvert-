"use client";

import React, { useState, useRef, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

export function PdfRotatorTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rotationDegrees, setRotationDegrees] = useState<Record<number, number>>({});
  
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
      return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    } catch {
      return false;
    }
  };

  const generateThumbnails = async (buffer: Uint8Array, pagesCount: number) => {
    if (!pdfJsRef.current) return;
    try {
      const pdf = await pdfJsRef.current.getDocument({ data: buffer }).promise;
      const thumbs: string[] = [];
      const limit = Math.min(pagesCount, 100);
      
      for (let i = 1; i <= limit; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
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
      setError(t("tools.pdf-rotator.invalidFile"));
      return;
    }

    try {
      const buf = await f.arrayBuffer();
      const uint8 = new Uint8Array(buf);
      setFileBuffer(uint8);
      
      const pdfDoc = await PDFDocument.load(uint8, { ignoreEncryption: true });
      const pages = pdfDoc.getPageCount();
      
      setFile(f);
      setNumPages(pages);
      
      // Select all by default
      const newSet = new Set<number>();
      const initialRotation: Record<number, number> = {};
      for (let i = 1; i <= pages; i++) {
        newSet.add(i);
        initialRotation[i] = 0;
      }
      setSelectedPages(newSet);
      setRotationDegrees(initialRotation);
      
      generateThumbnails(uint8, pages);
    } catch (err) {
      console.error(err);
      setError(t("tools.pdf-rotator.invalidFile"));
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileBuffer(null);
    setNumPages(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setRotationDegrees({});
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

  const applyRotation = (deg: number) => {
    setRotationDegrees(prev => {
      const next = { ...prev };
      selectedPages.forEach(p => {
        next[p] = (next[p] + deg) % 360;
      });
      return next;
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!fileBuffer) return;
    
    // Check if any rotation was applied
    const hasRotation = Object.values(rotationDegrees).some(r => r !== 0);
    if (!hasRotation) {
      setError("Please apply rotation to at least one page.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const pageNum = i + 1;
        const rot = rotationDegrees[pageNum];
        if (rot && rot !== 0) {
          // pdf-lib rotation is clockwise
          // Current rotation + new rotation
          const currentRotation = pages[i].getRotation().angle;
          pages[i].setRotation(degrees(currentRotation + rot));
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "auraconvert-rotated.pdf");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Error exporting PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.pdf-rotator.securityNotice")}</p>
      </div>

      {!file && (
        <div className="space-y-4">
          <Dropzone
            onFileSelect={(f) => handleFileSelect([f])}
            accept=".pdf,application/pdf"
            multiple={false}
            label={t("tools.pdf-rotator.uploadTitle")}
            description={t("tools.pdf-rotator.uploadFormats")}
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
                <p className="text-xs text-muted-foreground">{t("tools.pdf-rotator.pageCount", { count: numPages })}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors border border-destructive/20 shrink-0"
            >
              {t("tools.pdf-rotator.clearBtn")}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="settings" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-rotator.pageSelection")}
                </h3>
                
                <div className="flex gap-2">
                  <button onClick={selectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-rotator.selectAll")}
                  </button>
                  <button onClick={deselectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-rotator.deselectAll")}
                  </button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="refresh-cw" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-rotator.rotationOptions")}
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    disabled={selectedPages.size === 0}
                    onClick={() => applyRotation(-90)} 
                    className="flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border disabled:opacity-50"
                  >
                    <Icon name="rotate-ccw" className="w-4 h-4" />
                    {t("tools.pdf-rotator.rotateLeft")}
                  </button>
                  <button 
                    disabled={selectedPages.size === 0}
                    onClick={() => applyRotation(90)} 
                    className="flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border disabled:opacity-50"
                  >
                    <Icon name="rotate-cw" className="w-4 h-4" />
                    {t("tools.pdf-rotator.rotateRight")}
                  </button>
                  <button 
                    disabled={selectedPages.size === 0}
                    onClick={() => applyRotation(180)} 
                    className="flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border disabled:opacity-50"
                  >
                    <Icon name="refresh-cw" className="w-4 h-4" />
                    {t("tools.pdf-rotator.rotate180")}
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Icon name="refresh" className="w-4 h-4 animate-spin" />
                      {t("tools.pdf-rotator.processing")}
                    </>
                  ) : (
                    <>
                      <Icon name="download" className="w-4 h-4" />
                      {t("tools.pdf-rotator.exportBtn")}
                    </>
                  )}
                </button>
                
                {error && <p className="text-xs text-destructive text-center font-semibold">{error}</p>}
                {success && <p className="text-xs text-green-500 text-center font-semibold">{t("tools.pdf-rotator.downloadSuccess")}</p>}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-3 bg-background border border-border rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: numPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isSelected = selectedPages.has(pageNum);
                  const thumb = thumbnails[idx];
                  const currentRot = rotationDegrees[pageNum] || 0;

                  return (
                    <div 
                      key={pageNum}
                      onClick={() => togglePage(pageNum)}
                      className="relative flex flex-col items-center gap-3 cursor-pointer group select-none"
                    >
                      <div className={cn(
                        "w-full aspect-[1/1.4] rounded-lg border-2 overflow-hidden transition-all duration-300 relative bg-white flex items-center justify-center",
                        isSelected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                      )}>
                        <div 
                          className="w-full h-full flex items-center justify-center transition-transform duration-500" 
                          style={{ transform: `rotate(${currentRot}deg)` }}
                        >
                          {thumb ? (
                            <img src={thumb} alt={`Page ${pageNum}`} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <Icon name="file-text" className="w-8 h-8 text-muted-foreground/30" />
                          )}
                        </div>
                        
                        <div className={cn(
                          "absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center transition-all z-10",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-black/20 text-transparent opacity-0 group-hover:opacity-100 border border-white/50"
                        )}>
                          <Icon name="check" className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                        isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}>
                        {pageNum}
                        {currentRot !== 0 && <span className="text-[10px] opacity-70 ml-1">{currentRot > 0 ? `+${currentRot}°` : `${currentRot}°`}</span>}
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
