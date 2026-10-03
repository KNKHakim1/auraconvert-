"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

export function ImageResizerTool() {
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileSelect(selectedFile: File) {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const bitmap = await createImageBitmap(selectedFile);
      setOriginalSize({ w: bitmap.width, h: bitmap.height });
      setTargetWidth(bitmap.width);
      setTargetHeight(bitmap.height);
      setResizedUrl(null);
      setProgress(0);
    }
  }

  function handleWidthChange(newW: number) {
    setTargetWidth(newW);
    if (keepAspect && originalSize.w > 0) {
      setTargetHeight(Math.round(newW * (originalSize.h / originalSize.w)));
    }
  }

  function handleHeightChange(newH: number) {
    setTargetHeight(newH);
    if (keepAspect && originalSize.h > 0) {
      setTargetWidth(Math.round(newH * (originalSize.w / originalSize.h)));
    }
  }

  async function processResize() {
    if (!file || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);
    setProgress(10);
    setResizedUrl(null);
    try {
      await new Promise(r => setTimeout(r, 150));
      setProgress(30);
      const bitmap = await createImageBitmap(file);
      setProgress(50);
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // smooth resize
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      
      setProgress(75);
      await new Promise(r => setTimeout(r, 150));
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, file.type, 0.9);
      });
      
      if (blob) {
        setResizedUrl(URL.createObjectURL(blob));
        setProgress(100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
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
            <p className="text-sm text-zinc-500">Orijinal: {originalSize.w} x {originalSize.h} px</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFile(null);
            setResizedUrl(null);
          }}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          {t("characterCounter.reset")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Genişlik (Width)</span>
          <div className="relative">
            <input
              type="number"
              value={targetWidth || ""}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">px</span>
          </div>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Yükseklik (Height)</span>
          <div className="relative">
            <input
              type="number"
              value={targetHeight || ""}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">px</span>
          </div>
        </label>
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={keepAspect} 
          onChange={(e) => setKeepAspect(e.target.checked)}
          className="rounded border-zinc-300 text-primary-500 focus:ring-primary-500"
        />
        <span className="text-sm text-zinc-700">En-boy oranını koru</span>
      </label>

      <button
        onClick={processResize}
        disabled={isProcessing}
        className="relative w-full overflow-hidden rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-90"
      >
        {isProcessing && (
          <div 
            className="absolute inset-y-0 left-0 bg-black/20 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative z-10">
          {isProcessing ? "İşleniyor..." : "Boyutlandır"}
        </span>
      </button>

      {resizedUrl && (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 flex flex-col items-center space-y-6">
          <div className="flex items-center justify-between w-full max-w-md bg-white px-6 py-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Eski Boyutlar</p>
              <p className="text-sm font-medium text-zinc-400 line-through">{originalSize.w} x {originalSize.h} px</p>
            </div>
            
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-50 text-primary-500 mx-4">
              <Icon name="chevron" className="h-5 w-5 -rotate-90" />
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">Yeni Boyutlar</p>
              <p className="text-lg font-bold text-zinc-900">{targetWidth} x {targetHeight} px</p>
            </div>
          </div>
          
          <a
            href={resizedUrl}
            download={`auraconvert-resized-${file.name}`}
            className="w-full max-w-md inline-flex justify-center items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-base font-semibold text-white transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 shadow-sm hover:-translate-y-0.5"
          >
            <Icon name="files" />
            Boyutlandırılmış Görseli İndir
          </a>
        </div>
      )}
    </div>
  );
}
