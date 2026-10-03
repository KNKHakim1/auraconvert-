"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export function PdfTextExtractorTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    setError(null);
    setFile(null);
    setPdfDoc(null);
    setExtractedText("");
    
    if (selected.type !== "application/pdf") {
      setError(t("tools.pdf-text-extractor.invalidFile"));
      return;
    }

    try {
      // Magic bytes check (%PDF-)
      const buffer = await selected.slice(0, 5).arrayBuffer();
      const view = new Uint8Array(buffer);
      const magic = String.fromCharCode(...view);
      if (magic !== "%PDF-") {
        setError(t("tools.pdf-text-extractor.invalidFile"));
        return;
      }

      setFile(selected);
      const fileData = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileData });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setPageCount(pdf.numPages);
    } catch (err) {
      setError(t("tools.pdf-text-extractor.invalidFile"));
    }
  };

  const extractText = async () => {
    if (!pdfDoc) return;
    setIsExtracting(true);
    setExtractedText("");
    setError(null);

    try {
      let fullText = "";
      
      const pagesToExtract = selectedPage === "all" 
        ? Array.from({ length: pageCount }, (_, i) => i + 1)
        : [parseInt(selectedPage)];

      for (const pageNum of pagesToExtract) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        
        fullText += (selectedPage === "all" && pagesToExtract.length > 1 ? `\n\n--- ${t("tools.pdf-text-extractor.extractPage").replace("{page}", pageNum.toString())} ---\n\n` : "") + pageText;
      }

      const cleanedText = fullText.trim();
      
      if (!cleanedText) {
        setError(t("tools.pdf-text-extractor.emptyWarning"));
      } else {
        setExtractedText(cleanedText);
      }
    } catch (err) {
      setError(t("tools.pdf-text-extractor.invalidFile"));
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file ? `${file.name.replace(".pdf", "")}-extracted.txt` : "extracted.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
  };

  const clear = () => {
    setFile(null);
    setPdfDoc(null);
    setExtractedText("");
    setError(null);
    setSelectedPage("all");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {!file && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-background border-2 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group min-h-[300px]"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon name="upload" className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("tools.pdf-text-extractor.upload")}</h3>
          <p className="text-muted-foreground">{t("tools.pdf-text-extractor.dragDrop")}</p>
        </div>
      )}

      <input 
        type="file" 
        accept=".pdf" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center gap-3 font-medium">
          <Icon name="alert-circle" className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {file && pdfDoc && (
        <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="file-text" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground truncate max-w-[200px] md:max-w-md">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{t("tools.pdf-text-extractor.pageCount").replace("{count}", pageCount.toString())}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary flex-1 md:w-48"
              >
                <option value="all">{t("tools.pdf-text-extractor.extractAll")}</option>
                {Array.from({ length: pageCount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {t("tools.pdf-text-extractor.extractPage").replace("{page}", (i + 1).toString())}
                  </option>
                ))}
              </select>
              <button 
                onClick={extractText} 
                disabled={isExtracting}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shrink-0"
              >
                {isExtracting ? t("tools.pdf-text-extractor.extracting") : (selectedPage === "all" ? t("tools.pdf-text-extractor.extractAll") : t("tools.pdf-text-extractor.extractPage").replace("{page}", selectedPage))}
              </button>
            </div>
          </div>

          {extractedText && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
              <textarea 
                value={extractedText} 
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-64 md:h-96 p-4 bg-secondary/30 border border-border rounded-2xl resize-none outline-none focus:border-primary font-medium"
                placeholder="..."
              />
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={copyToClipboard} className="flex-1 md:flex-none px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                  <Icon name="copy" className="w-5 h-5" />
                  {t("tools.pdf-text-extractor.copy")}
                </button>
                <button onClick={downloadTxt} className="flex-1 md:flex-none px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                  <Icon name="download" className="w-5 h-5" />
                  {t("tools.pdf-text-extractor.downloadTxt")}
                </button>
                <button onClick={clear} className="w-full md:w-auto px-6 py-3 bg-destructive/10 text-destructive font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-destructive/20 transition-all md:ml-auto">
                  <Icon name="trash" className="w-5 h-5" />
                  {t("tools.pdf-text-extractor.clear")}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
