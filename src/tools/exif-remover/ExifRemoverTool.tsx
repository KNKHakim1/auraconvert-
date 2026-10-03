"use client";

import React, { useState } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";

export function ExifRemoverTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (files: File[]) => {
    setError(null);
    setSuccess(false);
    if (files.length === 0) return;
    
    const f = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError(t("tools.exif-remover.invalidFile"));
      return;
    }

    setFile(f);
    setFileSize(f.size);
    setImgUrl(URL.createObjectURL(f));
  };

  const clearFile = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setFile(null);
    setImgUrl("");
    setFileSize(0);
    setError(null);
    setSuccess(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveExif = async () => {
    if (!file || !imgUrl) return;
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const img = new Image();
      img.src = imgUrl;
      await new Promise(r => img.onload = r);

      // Using Canvas to redraw the image natively strips out all EXIF, GPS, and camera metadata
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.drawImage(img, 0, 0);

      // Export as JPEG (most common format for EXIF) with high quality
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpeg";
      const mime = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      
      const dataUrl = canvas.toDataURL(mime, 0.95);
      
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `auraconvert-no-exif.${ext === "jpeg" ? "jpg" : ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Error processing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <div className="space-y-2">
          <p className="font-semibold">{t("tools.exif-remover.securityNotice")}</p>
          <p className="text-xs opacity-90">{t("tools.exif-remover.infoBox")}</p>
        </div>
      </div>

      {!file && (
        <div className="space-y-4">
          <Dropzone
            onFileSelect={(f) => handleFileSelect([f])}
            accept="image/jpeg,image/png,image/webp"
            multiple={false}
            label={t("tools.exif-remover.uploadTitle")}
            description={t("tools.exif-remover.uploadFormats")}
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
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
          
          <div className="w-48 h-48 shrink-0 bg-secondary/30 rounded-lg overflow-hidden flex items-center justify-center border border-border p-2">
            <img src={imgUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg truncate max-w-xs">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{t("tools.exif-remover.originalSize")}: {formatSize(fileSize)}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRemoveExif}
                disabled={isProcessing}
                className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Icon name="refresh" className="w-4 h-4 animate-spin" /> : <Icon name="shield" className="w-4 h-4" />}
                {t("tools.exif-remover.removeBtn")}
              </button>
              
              <button
                onClick={clearFile}
                className="px-6 py-3 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-all border border-border"
              >
                {t("tools.exif-remover.clearBtn")}
              </button>
            </div>

            {error && <p className="text-sm text-destructive font-semibold">{error}</p>}
            {success && <p className="text-sm text-green-500 font-semibold flex items-center gap-2"><Icon name="check" className="w-4 h-4" />{t("tools.exif-remover.downloadSuccess")}</p>}
          </div>

        </div>
      )}

    </div>
  );
}
