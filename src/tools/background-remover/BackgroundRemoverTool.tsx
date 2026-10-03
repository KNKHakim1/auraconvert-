"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { removeBackground } from "@imgly/background-removal";

export function BackgroundRemoverTool() {
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileSelect(selectedFile: File) {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setResultUrl(null);
      setProgress(0);
      
      setIsProcessing(true);
      try {
        const publicPath = 'https://unpkg.com/@imgly/background-removal-data@1.4.5/dist/';
        const imageBlob = await removeBackground(selectedFile, {
          publicPath,
          progress: (key, current, total) => {
            if (key.includes("fetch")) {
              setProgress(Math.round((current / total) * 50)); // Downloading models
            } else if (key.includes("compute")) {
              setProgress(50 + Math.round((current / total) * 50)); // Processing
            }
          }
        });
        
        setResultUrl(URL.createObjectURL(imageBlob));
        setProgress(100);
      } catch (err: any) {
        console.error("BG removal failed:", err);
        alert(`Arka plan silinirken bir hata oluştu: ${err.message || "Bilinmeyen hata"}. Lütfen farklı bir görselle tekrar deneyin.`);
      } finally {
        setIsProcessing(false);
      }
    }
  }

  if (!file || !originalUrl) {
    return <Dropzone onFileSelect={handleFileSelect} accept="image/*" label="Arka planı silinecek görseli seçin" />;
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
            <p className="text-sm text-zinc-500">Tarayıcı içi yapay zeka</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFile(null);
            setOriginalUrl(null);
            setResultUrl(null);
          }}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
          disabled={isProcessing}
        >
          {t("characterCounter.reset")}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center">
        {isProcessing ? (
          <div className="py-12 flex flex-col items-center space-y-4">
            <div className="relative h-2 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
              <div 
                className="absolute inset-y-0 left-0 bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-zinc-600">
              {progress < 50 ? "Yapay zeka modelleri yükleniyor... Lütfen bekleyin" : "Arka plan siliniyor..."}
            </p>
            <p className="text-xs text-zinc-400">Bu işlem tamamen tarayıcınızda, cihazınızın gücüyle gerçekleşir.</p>
          </div>
        ) : resultUrl ? (
          <div className="space-y-6 flex flex-col items-center">
            {/* Checkerboard background for transparent image */}
            <div 
              className="relative overflow-hidden rounded-xl border border-zinc-200 shadow-sm max-h-80 w-full flex justify-center bg-white"
              style={{
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><rect width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/></svg>')",
                backgroundRepeat: "repeat"
              }}
            >
              <img src={resultUrl} alt="Result" className="object-contain max-h-80 w-full" />
            </div>
            
            <a
              href={resultUrl}
              download={`auraconvert-background-removed-${file.name.replace(/\.[^/.]+$/, ".png")}`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 shadow-sm"
            >
              <Icon name="files" />
              Arka Plansız Görseli İndir
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
