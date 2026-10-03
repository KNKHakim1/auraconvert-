"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

export function ImageCompressorTool() {
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function processImage(f: File, q: number) {
    if (!f) return;
    setIsProcessing(true);
    try {
      const bitmap = await createImageBitmap(f);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // JPEG desteklemediği için saydam arka planları beyaza boya
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(bitmap, 0, 0);
      
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", q / 100);
      });
      
      if (blob) {
        setCompressedUrl(URL.createObjectURL(blob));
        setCompressedSize(blob.size);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFileSelect(selectedFile: File) {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      processImage(selectedFile, quality);
    }
  }

  function handleQualityChange(newQuality: number) {
    setQuality(newQuality);
    if (file) {
      processImage(file, newQuality);
    }
  }

  if (!file) {
    return <Dropzone onFileSelect={handleFileSelect} accept="image/*" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-500 shadow-sm">
            <Icon name="image" className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
            <p className="text-sm text-zinc-500">Orijinal: {(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFile(null);
            setCompressedUrl(null);
          }}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          {t("characterCounter.reset")}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-zinc-700">Kalite (Quality)</label>
          <span className="text-sm font-medium text-zinc-900">%{quality}</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => handleQualityChange(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center min-h-[300px] flex items-center justify-center">
        {!compressedUrl ? (
          <p className="py-8 text-zinc-500 animate-pulse">İşleniyor...</p>
        ) : (
          <div className={`space-y-6 flex flex-col items-center w-full transition-opacity duration-200 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
            <div 
              className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm flex items-center justify-center w-full max-h-64"
              style={{
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><rect width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/></svg>')",
                backgroundRepeat: "repeat"
              }}
            >
              <img src={compressedUrl} alt="Compressed preview" className="object-contain max-h-64" />
            </div>
            
            <div className="flex items-center gap-4 sm:gap-8 mt-2 bg-white px-6 py-4 rounded-2xl border border-zinc-200 shadow-sm w-full max-w-md justify-between">
              <div className="flex flex-col items-center">
                <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Eski Boyut</p>
                <p className="text-lg sm:text-xl font-medium text-zinc-400 line-through">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-50 text-primary-500">
                  <Icon name="chevron" className="h-5 w-5 -rotate-90" />
                </div>
                {compressedSize && file.size > 0 && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    %{Math.round((1 - compressedSize / file.size) * 100)} KAZANÇ
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <p className="text-[10px] sm:text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">Yeni Boyut</p>
                <p className="text-xl sm:text-2xl font-bold text-zinc-900">{compressedSize ? (compressedSize / 1024).toFixed(1) : "0"} KB</p>
              </div>
            </div>

            <a
              href={compressedUrl}
              download={`auraconvert-compressed-${file.name.replace(/\.[^/.]+$/, ".jpg")}`}
              className="mt-2 w-full max-w-md inline-flex justify-center items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-base font-semibold text-white transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 shadow-sm hover:-translate-y-0.5"
            >
              <Icon name="files" />
              Sıkıştırılmış Görseli İndir
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
