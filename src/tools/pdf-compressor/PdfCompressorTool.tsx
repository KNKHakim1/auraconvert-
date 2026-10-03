"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";

type QualityLevel = "low" | "medium" | "high";

interface QualitySetting {
  id: QualityLevel;
  label: string;
  desc: string;
  scale: number;
  jpegQuality: number;
}

const QUALITY_SETTINGS: Record<QualityLevel, QualitySetting> = {
  low: { id: "low", label: "Yüksek Sıkıştırma", desc: "Küçük dosya, düşük kalite", scale: 1.0, jpegQuality: 0.5 },
  medium: { id: "medium", label: "Orta (Önerilen)", desc: "Dengeli boyut ve kalite", scale: 1.5, jpegQuality: 0.75 },
  high: { id: "high", label: "Düşük Sıkıştırma", desc: "Büyük dosya, yüksek kalite", scale: 2.0, jpegQuality: 0.9 }
};

export function PdfCompressorTool() {
  const { t, locale } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // To avoid NextJS SSR errors, we load modules dynamically inside the effect/handler
  const jsPdfRef = useRef<any>(null);
  const pdfJsRef = useRef<any>(null);

  useEffect(() => {
    // Load pdf.js client-side only
    const initPdfJs = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        // Use the worker we copied to public/pdfjs
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        pdfJsRef.current = pdfjsLib;
        
        const { jsPDF } = await import("jspdf");
        jsPdfRef.current = jsPDF;
      } catch (err) {
        console.error("Failed to load PDF libraries", err);
      }
    };
    initPdfJs();
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError(locale === "tr" ? "Lütfen geçerli bir PDF dosyası yükleyin." : "Please upload a valid PDF file.");
      return;
    }

    // Magic Bytes check
    try {
      const buffer = await selectedFile.slice(0, 4).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
        setError(locale === "tr" ? "Lütfen geçerli bir PDF dosyası yükleyin." : "Please upload a valid PDF file.");
        return;
      }
    } catch (err) {
      setError(locale === "tr" ? "Dosya okunamadı." : "File could not be read.");
      return;
    }

    setFile(selectedFile);
    setResultBlob(null);
    setError(null);
    setProgress(0);
  };

  const handleCompress = async () => {
    if (!file) return;
    if (!pdfJsRef.current || !jsPdfRef.current) {
      setError("PDF motoru henüz yüklenmedi veya yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.");
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJsRef.current.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const setting = QUALITY_SETTINGS[quality];
      // We start a new jsPDF document. 
      // A4 portrait is default, but we will adapt it per page.
      const doc = new jsPdfRef.current({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true // Enables zlib compression for the output PDF
      });
      
      doc.deletePage(1); // Remove the initial blank page

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // Yield to browser event loop to prevent UI freezing
        await new Promise(r => setTimeout(r, 0));
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: setting.scale });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas 2D context oluşturulamadı");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Fill white background (PDFs are transparent by default, making JPEG black)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        // Get JPEG base64
        const imgData = canvas.toDataURL("image/jpeg", setting.jpegQuality);
        
        // Original page dimensions in points (pt)
        const pdfViewport = page.getViewport({ scale: 1.0 });
        const isLandscape = pdfViewport.width > pdfViewport.height;

        doc.addPage([pdfViewport.width, pdfViewport.height], isLandscape ? "landscape" : "portrait");
        doc.addImage(imgData, "JPEG", 0, 0, pdfViewport.width, pdfViewport.height, undefined, "FAST");
        
        setProgress(Math.round((pageNum / totalPages) * 100));
      }

      const outBlob = doc.output('blob');
      setResultBlob(outBlob);
    } catch (err) {
      console.error(err);
      setError("PDF sıkıştırılırken veya okunurken bir hata oluştu. Bozuk veya şifreli olabilir.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file.name.replace(/\.pdf$/i, "");
    a.download = `auraconvert-compressed-${baseName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("tools.pdf-compressor.name")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {t("tools.pdf-compressor.description")}
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Önemli Uyarı</p>
          <p>
            Bu işlem %100 tarayıcınızda gerçekleşir. PDF'inizdeki tüm sayfalar görsele (resme) dönüştürülerek yeniden PDF yapılır.
            Bu nedenle <strong>metinler seçilebilir özelliğini kaybeder.</strong> Salt okunur belgeler için uygundur.
          </p>
        </div>
      </div>

      {error && !file && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex gap-2 items-center">
          <Icon name="info" className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!file ? (
        <Dropzone
          accept="application/pdf,.pdf"
          onFileSelect={handleFileSelect}
          label="PDF dosyanızı yükleyin veya sürükleyin"
          description="Sadece PDF dosyaları (Maksimum 50MB)"
        />
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon name="pdf" className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Orijinal: {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isProcessing}
                title="Yeni Dosya"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            {!resultBlob && !isProcessing && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sıkıştırma Seviyesi</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(Object.keys(QUALITY_SETTINGS) as QualityLevel[]).map((level) => {
                      const s = QUALITY_SETTINGS[level];
                      return (
                        <button
                          key={level}
                          onClick={() => setQuality(level)}
                          className={`p-3 text-left border rounded-lg transition-colors ${
                            quality === level 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "hover:border-foreground/30"
                          }`}
                        >
                          <p className="text-sm font-semibold">{s.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleCompress}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Icon name="pdf" className="w-4 h-4" />
                    Sıkıştır
                  </button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-sm font-medium">PDF İşleniyor...</p>
                  <p className="text-xs text-muted-foreground mt-1">Tarayıcıda sıkıştırılıyor: %{progress}</p>
                </div>
                <div className="w-full max-w-xs h-2 bg-secondary rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex gap-2 items-center">
                <Icon name="info" className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {resultBlob && (
            <div className="p-4 sm:p-6 bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">İşlem Tamamlandı</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground line-through">
                    {formatBytes(file.size)}
                  </span>
                  <Icon name="arrow-right" className="w-3 h-3 text-muted-foreground" />
                  <span className={`text-sm font-bold ${resultBlob.size < file.size ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {formatBytes(resultBlob.size)}
                  </span>
                  {resultBlob.size < file.size && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full ml-1">
                      -%{Math.round((1 - resultBlob.size / file.size) * 100)}
                    </span>
                  )}
                  {resultBlob.size >= file.size && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full ml-1">
                      Boyut Küçülmedi
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="download" className="w-4 h-4" />
                İndir (.pdf)
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>
          Tüm işlemler yalnızca tarayıcınızda (istemci tarafında) gerçekleştirilir.
          Gizliliğiniz güvendedir, hiçbir dosya buluta yüklenmez veya kaydedilmez.
        </p>
      </div>
    </div>
  );
}
