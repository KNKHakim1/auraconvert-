"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

export function PdfSplitterTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");
  
  const [outputMode, setOutputMode] = useState<"one-pdf" | "extract-each">("one-pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pdfJsRef = useRef<any>(null);

  useEffect(() => {
    // Load pdf.js client-side only
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
      // Generate up to 100 thumbnails to avoid freezing UI
      const limit = Math.min(pagesCount, 100);
      
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
    setGlobalError(null);
    setSuccess(false);
    if (files.length === 0) return;
    const f = files[0];
    
    const isValid = await validateMagicBytes(f);
    if (!isValid || !f.name.toLowerCase().endsWith(".pdf")) {
      setGlobalError(t("tools.pdf-splitter.invalidFile"));
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
      setSelectedPages(new Set());
      setRangeInput("");
      
      generateThumbnails(uint8, pages);
    } catch (err) {
      console.error(err);
      setGlobalError(t("tools.pdf-splitter.invalidFile"));
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileBuffer(null);
    setNumPages(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setRangeInput("");
    setRangeError("");
    setGlobalError(null);
    setSuccess(false);
  };

  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    if (!rangeStr.trim()) return [];
    const parts = rangeStr.split(',');
    const pages = new Set<number>();

    for (const part of parts) {
      const r = part.trim();
      if (!r) continue;
      if (r.includes('-')) {
        const bounds = r.split('-');
        if (bounds.length !== 2) throw new Error();
        const start = parseInt(bounds[0], 10);
        const end = parseInt(bounds[1], 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error();
        }
        for (let i = start; i <= end; i++) pages.add(i);
      } else {
        const p = parseInt(r, 10);
        if (isNaN(p) || p < 1 || p > maxPages) throw new Error();
        pages.add(p);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  // Sync selectedPages to rangeInput logic is tricky, so we'll just parse rangeInput when processing
  // Or parse it real-time and select. Let's make rangeInput update selectedPages if valid.
  useEffect(() => {
    if (!rangeInput) {
      setRangeError("");
      return;
    }
    try {
      const parsed = parsePageRange(rangeInput, numPages);
      setRangeError("");
      setSelectedPages(new Set(parsed));
    } catch {
      setRangeError(t("tools.pdf-splitter.errorParse"));
    }
  }, [rangeInput, numPages, t]);

  const togglePage = (pageNumber: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageNumber)) {
      newSet.delete(pageNumber);
    } else {
      newSet.add(pageNumber);
    }
    setSelectedPages(newSet);
    
    // Auto-update range input representation
    const arr = Array.from(newSet).sort((a, b) => a - b);
    setRangeInput(arr.join(", "));
    setRangeError("");
  };

  const selectAll = () => {
    const newSet = new Set<number>();
    for (let i = 1; i <= numPages; i++) newSet.add(i);
    setSelectedPages(newSet);
    setRangeInput(`1-${numPages}`);
    setRangeError("");
  };

  const deselectAll = () => {
    setSelectedPages(new Set());
    setRangeInput("");
    setRangeError("");
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

  const handleSplit = async () => {
    if (!fileBuffer || selectedPages.size === 0) {
      setGlobalError(t("tools.pdf-splitter.errorEmpty"));
      return;
    }
    
    try {
      setIsProcessing(true);
      setGlobalError(null);
      setSuccess(false);

      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b);
      // pdf-lib page indices are 0-based!
      const indices = pagesToExtract.map(p => p - 1);

      if (outputMode === "one-pdf") {
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, indices);
        copiedPages.forEach((page) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        const blob = new Blob([bytes as any], { type: "application/pdf" });
        downloadBlob(blob, `auraconvert-split.pdf`);
      } else {
        // Extract each
        for (const idx of indices) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(srcDoc, [idx]);
          newDoc.addPage(copiedPage);
          const bytes = await newDoc.save();
          const blob = new Blob([bytes as any], { type: "application/pdf" });
          downloadBlob(blob, `auraconvert-page-${idx + 1}.pdf`);
          
          // Small delay to allow browser to handle multiple downloads
          await new Promise(r => setTimeout(r, 300));
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setGlobalError("Error splitting PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.pdf-splitter.securityNotice")}</p>
      </div>

      {!file && (
        <div className="space-y-4">
          <Dropzone
            onFileSelect={(f) => handleFileSelect([f])}
            accept=".pdf,application/pdf"
            multiple={false}
            label={t("tools.pdf-splitter.uploadTitle")}
            description={t("tools.pdf-splitter.uploadFormats")}
          />
          {globalError && (
            <p className="text-sm text-destructive font-semibold flex items-center justify-center gap-2">
              <Icon name="info" className="w-4 h-4" />
              {globalError}
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
                <p className="text-xs text-muted-foreground">{t("tools.pdf-splitter.pageCount", { count: numPages })}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors border border-destructive/20 shrink-0"
            >
              {t("tools.pdf-splitter.clearBtn")}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="settings" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-splitter.pageSelection")}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">{t("tools.pdf-splitter.rangeLabel")}</label>
                    {rangeError && <span className="text-[10px] text-destructive">{t("tools.pdf-splitter.errorParse")}</span>}
                  </div>
                  <input 
                    type="text" 
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={t("tools.pdf-splitter.rangePlaceholder")}
                    className={cn(
                      "w-full p-2.5 bg-background border rounded-lg text-sm font-mono outline-none transition-colors",
                      rangeError ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary-500"
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={selectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-splitter.selectAll")}
                  </button>
                  <button onClick={deselectAll} className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                    {t("tools.pdf-splitter.deselectAll")}
                  </button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="download" className="w-4 h-4 text-primary" />
                  {t("tools.pdf-splitter.outputMode")}
                </h3>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/30 transition-colors">
                    <input 
                      type="radio" 
                      name="outputMode" 
                      checked={outputMode === "one-pdf"} 
                      onChange={() => setOutputMode("one-pdf")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{t("tools.pdf-splitter.modeOnePdf")}</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/30 transition-colors">
                    <input 
                      type="radio" 
                      name="outputMode" 
                      checked={outputMode === "extract-each"} 
                      onChange={() => setOutputMode("extract-each")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{t("tools.pdf-splitter.modeExtractEach")}</span>
                  </label>
                </div>

                <button
                  onClick={handleSplit}
                  disabled={isProcessing || selectedPages.size === 0 || !!rangeError}
                  className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Icon name="refresh" className="w-4 h-4 animate-spin" />
                      {t("tools.pdf-splitter.processing")}
                    </>
                  ) : (
                    <>
                      <Icon name="file-text" className="w-4 h-4" />
                      {t("tools.pdf-splitter.splitBtn")} ({selectedPages.size})
                    </>
                  )}
                </button>

                {globalError && (
                  <p className="text-xs text-destructive text-center font-semibold">{globalError}</p>
                )}
                {success && (
                  <p className="text-xs text-green-500 dark:text-green-400 text-center font-semibold">{t("tools.pdf-splitter.downloadSuccess")}</p>
                )}

              </div>

            </div>

            {/* Thumbnails Grid */}
            <div className="lg:col-span-2 bg-background border border-border rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: numPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isSelected = selectedPages.has(pageNum);
                  const thumb = thumbnails[idx];

                  return (
                    <div 
                      key={pageNum}
                      onClick={() => togglePage(pageNum)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 cursor-pointer group select-none",
                      )}
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
                        
                        {/* Checkbox Overlay */}
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
