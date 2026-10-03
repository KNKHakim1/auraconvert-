"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

type Format = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
const formats: { label: string; value: Format; ext: string }[] = [
  { label: "JPG", value: "image/jpeg", ext: "jpg" },
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "WebP", value: "image/webp", ext: "webp" },
  { label: "AVIF", value: "image/avif", ext: "avif" },
];

export function ImageConverterTool() {
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("image/png");
  
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [convertedFormatName, setConvertedFormatName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  function handleFileSelect(selectedFile: File) {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      if (selectedFile.type === "image/png") setTargetFormat("image/jpeg");
      else if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg") setTargetFormat("image/png");
      else setTargetFormat("image/jpeg");
      
      setConvertedUrl(null);
      setConvertedSize(null);
      setConvertedFormatName("");
    }
  }

  async function handleConvert() {
    if (!file) return;
    setIsProcessing(true);
    setConvertedUrl(null);
    setConvertedSize(null);
    
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context bulunamadı");
      
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(bitmap, 0, 0);
      
      await new Promise(r => setTimeout(r, 300));
      
      let blob: Blob | null = null;

      if (targetFormat === "image/avif") {
        try {
          const { encodeAvif } = await import('./avif-encoder');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const avifBuffer = await encodeAvif(imageData);
          blob = new Blob([avifBuffer], { type: "image/avif" });
        } catch (avifErr: any) {
          console.error("WASM AVIF encoding failed:", avifErr);
          throw new Error("AVIF dönüştürme hatası. Lütfen farklı bir format seçin veya tekrar deneyin.");
        }
      } else {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, targetFormat, 0.9);
        });
      }
      
      if (blob) {
        setConvertedUrl(URL.createObjectURL(blob));
        setConvertedSize(blob.size);
        const formatObj = formats.find(f => f.value === blob.type) || formats.find(f => f.value === targetFormat);
        setConvertedFormatName(formatObj ? formatObj.label : "Bilinmiyor");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Görsel dönüştürülürken bir hata oluştu: ${err.message || "Bilinmeyen hata"}`);
    } finally {
      setIsProcessing(false);
    }
  }

  function getExt(fName: string) {
    return fName.split('.').pop()?.toLowerCase() || '';
  }

  if (!file || !previewUrl) {
    return <Dropzone onFileSelect={handleFileSelect} accept="image/*" label="Dönüştürülecek görseli seçin" />;
  }

  const selectedFormatObj = formats.find(f => f.value === targetFormat);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-500 shadow-sm">
            <Icon name="image" className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
            <p className="text-sm text-zinc-500">
              Orijinal: {getExt(file.name).toUpperCase() || "Bilinmiyor"} • {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setFile(null);
            setPreviewUrl(null);
            setConvertedUrl(null);
          }}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
          disabled={isProcessing}
        >
          {t("characterCounter.reset")}
        </button>
      </div>

      {!convertedUrl && (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 flex flex-col items-center space-y-6">
          <div 
            className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm flex items-center justify-center w-full max-h-64"
            style={{
              backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><rect width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23e5e7eb\"/></svg>')",
              backgroundRepeat: "repeat"
            }}
          >
            <img src={previewUrl} alt="Original preview" className="object-contain max-h-64" />
          </div>

          <div className="w-full space-y-3">
            <label className="text-sm font-medium text-zinc-700">Hedef Format</label>
            <div className="grid grid-cols-4 gap-2">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTargetFormat(f.value)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                    targetFormat === f.value
                      ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-primary-500 hover:text-primary-500"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {targetFormat === "image/jpeg" && (
              <p className="text-xs text-zinc-500 mt-2">
                * Saydam arka planlar beyaz renk ile doldurulacaktır.
              </p>
            )}
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing || targetFormat === file.type}
            className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Dönüştürülüyor..." : "Dönüştür"}
          </button>
        </div>
      )}

      {convertedUrl && (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 flex flex-col items-center space-y-6">
          <div className="flex items-center justify-between w-full max-w-md bg-white px-6 py-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Eski Format</p>
              <p className="text-lg font-medium text-zinc-400 line-through">
                {getExt(file.name).toUpperCase()}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-50 text-primary-500 mx-4">
              <Icon name="chevron" className="h-5 w-5 -rotate-90" />
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">Yeni Format</p>
              <p className="text-xl font-bold text-zinc-900">{convertedFormatName}</p>
              <p className="text-[10px] font-medium text-primary-600 mt-0.5">
                {convertedSize ? (convertedSize / 1024).toFixed(1) : "0"} KB
              </p>
            </div>
          </div>
          
          <a
            href={convertedUrl}
            download={`auraconvert-converted-${file.name.replace(/\.[^/.]+$/, "." + (selectedFormatObj?.ext || "png"))}`}
            className="w-full max-w-md inline-flex justify-center items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-base font-semibold text-white transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 shadow-sm hover:-translate-y-0.5"
          >
            <Icon name="files" />
            Dönüştürülmüş Görseli İndir
          </a>
        </div>
      )}
    </div>
  );
}
