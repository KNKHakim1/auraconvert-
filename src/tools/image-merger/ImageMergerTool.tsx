"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

type ImgObj = { id: string; file: File; url: string; img: HTMLImageElement };

export function ImageMergerTool() {
  const { t } = useTranslations();
  
  const [images, setImages] = useState<ImgObj[]>([]);
  const [layout, setLayout] = useState<"horizontal" | "vertical" | "grid">("horizontal");
  const [spacing, setSpacing] = useState(10);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [outputFormat, setOutputFormat] = useState<"image/png" | "image/jpeg">("image/png");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFilesSelect = async (files: File[]) => {
    setError(null);
    setSuccess(false);
    
    const valid = files.filter(f => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    if (valid.length === 0) return;

    const newImgs: ImgObj[] = [];
    for (const f of valid) {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.src = url;
      await new Promise(r => img.onload = r);
      newImgs.push({ id: Math.random().toString(36).substr(2, 9), file: f, url, img });
    }

    setImages(prev => [...prev, ...newImgs]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(i => i.id !== id);
      const removed = prev.find(i => i.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
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
    images.forEach(i => URL.revokeObjectURL(i.url));
    setImages([]);
    setError(null);
    setSuccess(false);
  };

  const handleMerge = () => {
    if (images.length === 0) return;
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");

      let canvasW = 0;
      let canvasH = 0;
      const renders: { img: HTMLImageElement; x: number; y: number; w: number; h: number }[] = [];

      // Base size scaling to prevent overflow or broken ratios
      // We will normalize sizes relative to the first image
      const baseW = images[0].img.naturalWidth;
      const baseH = images[0].img.naturalHeight;

      if (layout === "horizontal") {
        let currentX = 0;
        let maxH = 0;
        for (const item of images) {
          const ratio = baseH / item.img.naturalHeight;
          const w = item.img.naturalWidth * ratio;
          const h = baseH;
          renders.push({ img: item.img, x: currentX, y: 0, w, h });
          currentX += w + spacing;
          maxH = Math.max(maxH, h);
        }
        canvasW = currentX - spacing;
        canvasH = maxH;
      } else if (layout === "vertical") {
        let currentY = 0;
        let maxW = 0;
        for (const item of images) {
          const ratio = baseW / item.img.naturalWidth;
          const w = baseW;
          const h = item.img.naturalHeight * ratio;
          renders.push({ img: item.img, x: 0, y: currentY, w, h });
          currentY += h + spacing;
          maxW = Math.max(maxW, w);
        }
        canvasW = maxW;
        canvasH = currentY - spacing;
      } else {
        // Grid
        const cols = Math.ceil(Math.sqrt(images.length));
        const rows = Math.ceil(images.length / cols);
        
        let maxW = 0;
        let maxH = 0;
        
        // Find maximum cell dimensions
        for (const item of images) {
          maxW = Math.max(maxW, item.img.naturalWidth);
          maxH = Math.max(maxH, item.img.naturalHeight);
        }

        // Keep grid cells uniform, image centered inside
        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          const col = i % cols;
          const row = Math.floor(i / cols);
          
          const cellX = col * (maxW + spacing);
          const cellY = row * (maxH + spacing);
          
          // Center inside cell
          const w = item.img.naturalWidth;
          const h = item.img.naturalHeight;
          const x = cellX + (maxW - w) / 2;
          const y = cellY + (maxH - h) / 2;
          
          renders.push({ img: item.img, x, y, w, h });
        }
        canvasW = cols * maxW + (cols - 1) * spacing;
        canvasH = rows * maxH + (rows - 1) * spacing;
      }

      // Memory check for Canvas (typically 16384 or 32767 limit)
      if (canvasW > 16000 || canvasH > 16000) {
        throw new Error("Merged image is too large for the browser to process. Try fewer images.");
      }

      canvas.width = canvasW;
      canvas.height = canvasH;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);

      for (const r of renders) {
        ctx.drawImage(r.img, r.x, r.y, r.w, r.h);
      }

      const ext = outputFormat === "image/png" ? "png" : "jpg";
      const dataUrl = canvas.toDataURL(outputFormat, 0.9);
      
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `auraconvert-merged.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error merging images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.image-merger.securityNotice")}</p>
      </div>

      <div className="space-y-4">
        <Dropzone
          onFilesSelect={handleFilesSelect}
          multiple={true}
          accept="image/jpeg,image/png,image/webp"
          label={t("tools.image-merger.uploadTitle")}
          description={t("tools.image-merger.uploadFormats")}
        />
        {error && (
          <p className="text-sm text-destructive font-semibold flex items-center justify-center gap-2">
            <Icon name="info" className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between bg-secondary/30 border border-border p-3 rounded-xl">
              <span className="text-sm font-semibold">{images.length} Image(s)</span>
              <button onClick={clearAll} className="text-xs font-medium text-destructive px-3 py-1 rounded hover:bg-destructive/10">
                {t("tools.image-merger.clearBtn")}
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group bg-background border border-border rounded-xl overflow-hidden shadow-sm aspect-square">
                  <img src={img.url} className="w-full h-full object-contain p-2" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeImage(img.id)} className="w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive shadow-sm">
                      <Icon name="x" className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button disabled={idx === 0} onClick={() => moveImage(idx, -1)} className="p-1 hover:bg-secondary rounded disabled:opacity-30">
                      <Icon name="arrow-left" className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono">{idx + 1}</span>
                    <button disabled={idx === images.length - 1} onClick={() => moveImage(idx, 1)} className="p-1 hover:bg-secondary rounded disabled:opacity-30">
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold">{t("tools.image-merger.layoutTitle")}</h3>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setLayout("horizontal")} className={cn("py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2", layout === "horizontal" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border")}>
                  <Icon name="layout" className="w-4 h-4 rotate-90" /> {t("tools.image-merger.layoutHorizontal")}
                </button>
                <button onClick={() => setLayout("vertical")} className={cn("py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2", layout === "vertical" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border")}>
                  <Icon name="layout" className="w-4 h-4" /> {t("tools.image-merger.layoutVertical")}
                </button>
                <button onClick={() => setLayout("grid")} className={cn("py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2", layout === "grid" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border")}>
                  <Icon name="grid" className="w-4 h-4" /> {t("tools.image-merger.layoutGrid")}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold block">{t("tools.image-merger.spacingTitle")}</label>
                <input type="number" min="0" max="200" value={spacing} onChange={(e) => setSpacing(Number(e.target.value) || 0)} className="w-full p-2 bg-secondary/30 border border-border rounded text-sm outline-none focus:border-primary" />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold block">{t("tools.image-merger.bgTitle")}</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 bg-secondary/30 border border-border rounded cursor-pointer" />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold block">{t("tools.image-merger.formatTitle")}</label>
                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as any)} className="w-full p-2 bg-secondary/30 border border-border rounded text-sm outline-none focus:border-primary">
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG / JPEG</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={handleMerge} disabled={isProcessing} className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                {isProcessing ? <Icon name="refresh" className="w-4 h-4 animate-spin" /> : <Icon name="image" className="w-4 h-4" />}
                {t("tools.image-merger.mergeBtn")}
              </button>
              {success && <p className="text-xs text-green-500 mt-2 text-center font-semibold">{t("tools.image-merger.downloadSuccess")}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
