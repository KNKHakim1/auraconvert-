"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Dropzone } from "@/components/ui/Dropzone";
import { Icon } from "@/components/icons/Icon";
import { createIcoFromPngs } from "./ico-encoder";

type FaviconResult = {
  size: number;
  label: string;
  blob: Blob;
  url: string;
};

export function FaviconGeneratorTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FaviconResult[]>([]);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);

  const SIZES = [
    { size: 16, label: "16x16" },
    { size: 32, label: "32x32" },
    { size: 48, label: "48x48" },
    { size: 180, label: "180x180 (iOS)" },
    { size: 192, label: "192x192 (Android)" },
    { size: 512, label: "512x512 (Splash)" },
  ];

  const handleFile = async (newFile: File) => {
    setFile(newFile);
    setIsProcessing(true);
    setResults([]);
    if (icoUrl) {
      URL.revokeObjectURL(icoUrl);
      setIcoUrl(null);
    }

    try {
      // 1. We create an Object URL to draw the image/svg to a canvas
      const objectUrl = URL.createObjectURL(newFile);
      
      const img = new Image();
      img.src = objectUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image for canvas."));
      });
      
      const generatedResults: FaviconResult[] = [];
      const icoImages: { buffer: ArrayBuffer; width: number; height: number }[] = [];
      
      // 2. Generate PNGs for each size
      for (const { size, label } of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2d context");

        // The default canvas is transparent rgba(0,0,0,0)
        // We do NOT fill rect with white. We let image draw with its natural alpha channel
        ctx.drawImage(img, 0, 0, size, size);

        // Convert to Blob as image/png
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("toBlob failed"));
          }, "image/png");
        });

        const url = URL.createObjectURL(blob);
        generatedResults.push({ size, label, blob, url });

        // Save 16, 32, 48 for ICO packing
        if ([16, 32, 48].includes(size)) {
          const arrayBuffer = await blob.arrayBuffer();
          icoImages.push({ buffer: arrayBuffer, width: size, height: size });
        }
      }

      setResults(generatedResults);

      // 3. Generate multi-resolution .ico file
      const icoBuffer = await createIcoFromPngs(icoImages);
      const icoBlob = new Blob([icoBuffer], { type: "image/x-icon" });
      setIcoUrl(URL.createObjectURL(icoBlob));

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert("Görsel işlenirken bir hata oluştu.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    results.forEach(r => URL.revokeObjectURL(r.url));
    if (icoUrl) URL.revokeObjectURL(icoUrl);
    setFile(null);
    setResults([]);
    setIcoUrl(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getBaseName = () => {
    if (!file) return "favicon";
    return file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("tools.favicon-generator.name")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {t("tools.favicon-generator.description")}
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFileSelect={handleFile}
          accept="image/jpeg, image/png, image/webp, image/svg+xml"
          label="Görsel yükle veya sürükle (PNG, SVG, JPG)"
          description="En iyi sonuç için 512x512 kare veya SVG formatı kullanın"
        />
      ) : isProcessing ? (
        <div className="bg-card border rounded-lg p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm font-medium">Favicon seti oluşturuluyor...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0 border overflow-hidden">
                {results.length > 0 && (
                  <img src={results[1].url} alt="Favicon preview" className="w-8 h-8 object-contain" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-sm truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  6 farklı boyut üretildi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={clearFile}
                className="w-full sm:w-auto px-4 py-2 border bg-background hover:bg-secondary text-sm font-medium rounded-md transition-colors"
              >
                Yeni Yükle
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
            <Icon name="info" className="w-5 h-5 shrink-0" />
            <p>
              Favicon üretiminiz tamamen tarayıcınızda (yerel olarak) yapıldı. Görseliniz hiçbir sunucuya yüklenmedi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Main favicon.ico card */}
            {icoUrl && (
              <div className="bg-card border rounded-lg p-4 flex flex-col items-center text-center space-y-3 col-span-2 md:col-span-3 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-16 h-16 bg-background rounded-lg border shadow-sm flex items-center justify-center overflow-hidden mb-2 relative group">
                  <img 
                    src={icoUrl} 
                    alt="favicon.ico" 
                    className="w-8 h-8 object-contain" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold">.ICO</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-base">favicon.ico</h4>
                  <p className="text-xs text-muted-foreground mt-1">16x16, 32x32, 48x48 (Çoklu)</p>
                </div>
                <a
                  href={icoUrl}
                  download={`auraconvert-favicon-${getBaseName()}.ico`}
                  className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="download" className="w-4 h-4" />
                  İndir (.ico)
                </a>
              </div>
            )}

            {/* Individual PNG cards */}
            {results.map((res, i) => (
              <div key={i} className="bg-card border rounded-lg p-4 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-background rounded border shadow-sm flex items-center justify-center overflow-hidden checkerboard-bg">
                  <img 
                    src={res.url} 
                    alt={`${res.size}x${res.size} favicon`} 
                    style={{ 
                      width: Math.min(res.size, 48) + "px", 
                      height: Math.min(res.size, 48) + "px" 
                    }} 
                    className="object-contain" 
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{res.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{formatBytes(res.blob.size)}</p>
                </div>
                <a
                  href={res.url}
                  download={`auraconvert-favicon-${res.size}x${res.size}.png`}
                  className="w-full mt-auto px-3 py-1.5 border bg-background hover:bg-secondary text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  İndir
                </a>
              </div>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .checkerboard-bg {
              background-image: linear-gradient(45deg, #e5e5e5 25%, transparent 25%), 
                                linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #e5e5e5 75%), 
                                linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
              background-size: 16px 16px;
              background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
            }
            .dark .checkerboard-bg {
              background-image: linear-gradient(45deg, #2a2a2a 25%, transparent 25%), 
                                linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #2a2a2a 75%), 
                                linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
            }
          `}} />
        </div>
      )}
    </div>
  );
}
