"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

type ImageFile = {
  id: string;
  file: File;
  previewUrl: string;
};

export function JpgToPdfTool() {
  const { t } = useTranslations();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFilesSelect = (files: File[]) => {
    setError(null);
    setSuccess(false);
    
    const validFiles = files.filter(f => f.type === "image/jpeg" || f.type === "image/jpg" || f.type === "image/png");
    
    if (validFiles.length === 0) {
      setError(t("tools.jpg-to-pdf.invalidFile"));
      return;
    }

    const newImages = validFiles.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= images.length) return;
    setImages(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index + direction];
      arr[index + direction] = temp;
      return arr;
    });
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    setSuccess(false);
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

  const handleCreatePdf = async () => {
    if (images.length === 0) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const imgBytes = await img.file.arrayBuffer();
        let pdfImage;
        if (img.file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(imgBytes);
        } else {
          pdfImage = await pdfDoc.embedJpg(imgBytes);
        }

        const { width, height } = pdfImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "auraconvert-images.pdf");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Error creating PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.jpg-to-pdf.securityNotice")}</p>
      </div>

      <div className="space-y-4">
        <Dropzone
          onFilesSelect={handleFilesSelect}
          multiple={true}
          accept="image/jpeg,image/png"
          label={t("tools.jpg-to-pdf.uploadTitle")}
          description={t("tools.jpg-to-pdf.uploadFormats")}
        />
        {error && (
          <p className="text-sm text-destructive font-semibold flex items-center justify-center gap-2">
            <Icon name="info" className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/30 border border-border p-4 rounded-xl gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{images.length} Image(s)</p>
              <p className="text-xs text-muted-foreground">{t("tools.jpg-to-pdf.reorderInstructions")}</p>
            </div>
            <button
              onClick={clearAll}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors border border-destructive/20 shrink-0"
            >
              {t("tools.jpg-to-pdf.clearBtn")}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
                  <img src={img.previewUrl} alt={img.file.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeImage(img.id)} className="w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive shadow-sm">
                    <Icon name="x" className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    disabled={idx === 0} 
                    onClick={() => moveImage(idx, -1)} 
                    className="p-1 hover:bg-secondary rounded disabled:opacity-30 transition-colors"
                  >
                    <Icon name="arrow-left" className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono font-medium truncate px-1">
                    {idx + 1}
                  </span>
                  <button 
                    disabled={idx === images.length - 1} 
                    onClick={() => moveImage(idx, 1)} 
                    className="p-1 hover:bg-secondary rounded disabled:opacity-30 transition-colors"
                  >
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={handleCreatePdf}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Icon name="refresh" className="w-4 h-4 animate-spin" />
                  {t("tools.jpg-to-pdf.processing")}
                </>
              ) : (
                <>
                  <Icon name="file-text" className="w-4 h-4" />
                  {t("tools.jpg-to-pdf.createPdfBtn")}
                </>
              )}
            </button>
            {success && (
              <p className="text-xs text-green-500 font-semibold">{t("tools.jpg-to-pdf.downloadSuccess")}</p>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
