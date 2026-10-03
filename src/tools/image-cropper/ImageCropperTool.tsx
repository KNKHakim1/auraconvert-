"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";
import { cn } from "@/lib/cn";

export function ImageCropperTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/jpeg");
  const [aspect, setAspect] = useState<number | null>(null); // null means free
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Crop State (in percentages 0-100)
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<"move" | "se" | "sw" | "ne" | "nw" | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (files: File[]) => {
    setError(null);
    setSuccess(false);
    if (files.length === 0) return;
    const f = files[0];
    
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError(t("tools.image-cropper.invalidFile"));
      return;
    }

    setFile(f);
    setImgSrc(URL.createObjectURL(f));
    setCrop({ x: 10, y: 10, width: 80, height: 80 });
  };

  const clearFile = () => {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setFile(null);
    setImgSrc("");
    setError(null);
    setSuccess(false);
  };

  // Adjust crop when aspect ratio changes
  useEffect(() => {
    if (aspect && imageRef.current) {
      const img = imageRef.current;
      const imgAspect = img.clientWidth / img.clientHeight;
      
      let newW = crop.width;
      let newH = crop.height;
      
      // Calculate new dimensions based on container aspect ratio
      // Because crop width/height are percentages of the image container
      const actualW = (crop.width / 100) * img.clientWidth;
      const actualH = actualW / aspect;
      
      newH = (actualH / img.clientHeight) * 100;
      
      if (newH > 100) {
        newH = 100;
        const boundedW = newH * (img.clientHeight / img.clientWidth) * aspect;
        newW = boundedW * 100;
      }
      
      setCrop(prev => ({
        ...prev,
        width: newW,
        height: newH,
        // center it roughly
        x: Math.max(0, Math.min(100 - newW, prev.x)),
        y: Math.max(0, Math.min(100 - newH, prev.y))
      }));
    }
  }, [aspect]);

  // Mouse / Touch handlers for Crop Box
  const getClientPos = (e: ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as any).clientX, y: (e as any).clientY };
  };

  const onPointerDown = (e: ReactMouseEvent | ReactTouchEvent, action: "move" | "se" | "sw" | "ne" | "nw") => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    setIsDragging(true);
    setDragAction(action);
    setStartPos(getClientPos(e));
    setStartCrop({ ...crop });
  };

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      if (e.cancelable) e.preventDefault();
      
      const pos = getClientPos(e);
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;
      
      const img = imageRef.current;
      const dXPercent = (dx / img.clientWidth) * 100;
      const dYPercent = (dy / img.clientHeight) * 100;

      let newCrop = { ...startCrop };

      if (dragAction === "move") {
        newCrop.x = Math.max(0, Math.min(100 - newCrop.width, startCrop.x + dXPercent));
        newCrop.y = Math.max(0, Math.min(100 - newCrop.height, startCrop.y + dYPercent));
      } else {
        // Resizing logic
        if (dragAction === "se") {
          newCrop.width = Math.max(5, Math.min(100 - newCrop.x, startCrop.width + dXPercent));
          if (aspect) newCrop.height = newCrop.width * (img.clientWidth / img.clientHeight) / aspect;
          else newCrop.height = Math.max(5, Math.min(100 - newCrop.y, startCrop.height + dYPercent));
        } else if (dragAction === "sw") {
          const newX = Math.max(0, Math.min(startCrop.x + startCrop.width - 5, startCrop.x + dXPercent));
          newCrop.width = startCrop.width + (startCrop.x - newX);
          newCrop.x = newX;
          if (aspect) newCrop.height = newCrop.width * (img.clientWidth / img.clientHeight) / aspect;
          else newCrop.height = Math.max(5, Math.min(100 - newCrop.y, startCrop.height + dYPercent));
        } else if (dragAction === "ne") {
          newCrop.width = Math.max(5, Math.min(100 - newCrop.x, startCrop.width + dXPercent));
          if (aspect) {
            newCrop.height = newCrop.width * (img.clientWidth / img.clientHeight) / aspect;
            newCrop.y = startCrop.y + startCrop.height - newCrop.height;
          } else {
            const newY = Math.max(0, Math.min(startCrop.y + startCrop.height - 5, startCrop.y + dYPercent));
            newCrop.height = startCrop.height + (startCrop.y - newY);
            newCrop.y = newY;
          }
        } else if (dragAction === "nw") {
          const newX = Math.max(0, Math.min(startCrop.x + startCrop.width - 5, startCrop.x + dXPercent));
          newCrop.width = startCrop.width + (startCrop.x - newX);
          newCrop.x = newX;
          if (aspect) {
            newCrop.height = newCrop.width * (img.clientWidth / img.clientHeight) / aspect;
            newCrop.y = startCrop.y + startCrop.height - newCrop.height;
          } else {
            const newY = Math.max(0, Math.min(startCrop.y + startCrop.height - 5, startCrop.y + dYPercent));
            newCrop.height = startCrop.height + (startCrop.y - newY);
            newCrop.y = newY;
          }
        }

        // Clamp bounds
        if (newCrop.y < 0) {
          newCrop.y = 0;
          if (aspect) {
            newCrop.height = startCrop.y + startCrop.height;
            newCrop.width = newCrop.height * (img.clientHeight / img.clientWidth) * aspect;
            if (dragAction === "nw" || dragAction === "sw") newCrop.x = startCrop.x + startCrop.width - newCrop.width;
          }
        }
        if (newCrop.x + newCrop.width > 100) newCrop.width = 100 - newCrop.x;
        if (newCrop.y + newCrop.height > 100) newCrop.height = 100 - newCrop.y;
      }

      setCrop(newCrop);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      setDragAction(null);
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
    
    return () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, [isDragging, dragAction, startPos, startCrop, aspect]);

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCrop = async () => {
    if (!file || !imageRef.current) return;
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(false);

      const img = new Image();
      img.src = imgSrc;
      await new Promise(r => img.onload = r);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");

      // Calculate actual pixel coordinates on original image
      const sourceX = (crop.x / 100) * img.naturalWidth;
      const sourceY = (crop.y / 100) * img.naturalHeight;
      const sourceW = (crop.width / 100) * img.naturalWidth;
      const sourceH = (crop.height / 100) * img.naturalHeight;

      canvas.width = sourceW;
      canvas.height = sourceH;

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

      const ext = outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg";
      const dataUrl = canvas.toDataURL(outputFormat, 0.9);
      downloadDataUrl(dataUrl, `auraconvert-cropped.${ext}`);
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Error cropping image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 border border-blue-200 dark:border-blue-800/50">
        <Icon name="shield" className="w-5 h-5 shrink-0" />
        <p>{t("tools.image-cropper.securityNotice")}</p>
      </div>

      {!file && (
        <div className="space-y-4">
          <Dropzone
            onFileSelect={(f) => handleFileSelect([f])}
            accept="image/jpeg,image/png,image/webp"
            multiple={false}
            label={t("tools.image-cropper.uploadTitle")}
            description={t("tools.image-cropper.uploadFormats")}
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-3 bg-secondary/10 border border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] overflow-hidden select-none">
            <div 
              ref={containerRef} 
              className="relative max-w-full max-h-[60vh] inline-block touch-none"
            >
              <img 
                ref={imageRef} 
                src={imgSrc} 
                alt="Upload" 
                className="max-w-full max-h-[60vh] object-contain block select-none pointer-events-none" 
                draggable={false}
              />
              
              {/* Overlay mask */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />

              {/* Crop Box */}
              <div 
                className="absolute border-2 border-primary cursor-move touch-none overflow-hidden"
                style={{
                  top: `${crop.y}%`,
                  left: `${crop.x}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)" // fallback mask
                }}
                onMouseDown={(e) => onPointerDown(e, "move")}
                onTouchStart={(e) => onPointerDown(e, "move")}
              >
                {/* Real image portion revealed */}
                <div className="w-full h-full relative overflow-hidden pointer-events-none">
                  <img 
                    src={imgSrc} 
                    className="absolute max-w-none"
                    style={{
                      width: `${(100 / crop.width) * 100}%`,
                      height: `${(100 / crop.height) * 100}%`,
                      left: `-${(crop.x / crop.width) * 100}%`,
                      top: `-${(crop.y / crop.height) * 100}%`,
                    }}
                  />
                </div>

                {/* Handles */}
                <div 
                  className="absolute top-0 left-0 w-4 h-4 bg-primary border-2 border-white cursor-nwse-resize -translate-x-1/2 -translate-y-1/2 rounded-full"
                  onMouseDown={(e) => onPointerDown(e, "nw")}
                  onTouchStart={(e) => onPointerDown(e, "nw")}
                />
                <div 
                  className="absolute top-0 right-0 w-4 h-4 bg-primary border-2 border-white cursor-nesw-resize translate-x-1/2 -translate-y-1/2 rounded-full"
                  onMouseDown={(e) => onPointerDown(e, "ne")}
                  onTouchStart={(e) => onPointerDown(e, "ne")}
                />
                <div 
                  className="absolute bottom-0 left-0 w-4 h-4 bg-primary border-2 border-white cursor-nesw-resize -translate-x-1/2 translate-y-1/2 rounded-full"
                  onMouseDown={(e) => onPointerDown(e, "sw")}
                  onTouchStart={(e) => onPointerDown(e, "sw")}
                />
                <div 
                  className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-white cursor-nwse-resize translate-x-1/2 translate-y-1/2 rounded-full"
                  onMouseDown={(e) => onPointerDown(e, "se")}
                  onTouchStart={(e) => onPointerDown(e, "se")}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold">{t("tools.image-cropper.aspectRatio")}</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setAspect(null)} 
                  className={cn("py-2 text-xs font-semibold rounded-lg border", aspect === null ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border")}
                >
                  {t("tools.image-cropper.freeCrop")}
                </button>
                <button 
                  onClick={() => setAspect(1)} 
                  className={cn("py-2 text-xs font-semibold rounded-lg border", aspect === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border")}
                >
                  1:1 (Kare)
                </button>
                <button 
                  onClick={() => setAspect(4/3)} 
                  className={cn("py-2 text-xs font-semibold rounded-lg border", aspect === 4/3 ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border")}
                >
                  4:3
                </button>
                <button 
                  onClick={() => setAspect(16/9)} 
                  className={cn("py-2 text-xs font-semibold rounded-lg border", aspect === 16/9 ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border")}
                >
                  16:9
                </button>
                <button 
                  onClick={() => setAspect(3/2)} 
                  className={cn("py-2 text-xs font-semibold rounded-lg border", aspect === 3/2 ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border")}
                >
                  3:2
                </button>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold">{t("tools.image-cropper.formatTitle")}</h3>
              <select 
                value={outputFormat} 
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full p-2.5 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary-500"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCrop}
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Icon name="refresh" className="w-4 h-4 animate-spin" /> : <Icon name="crop" className="w-4 h-4" />}
                {t("tools.image-cropper.cropBtn")}
              </button>
              
              <button
                onClick={clearFile}
                className="w-full py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-all border border-border"
              >
                {t("tools.image-cropper.clearBtn")}
              </button>
              
              {error && <p className="text-xs text-destructive text-center font-semibold">{error}</p>}
              {success && <p className="text-xs text-green-500 text-center font-semibold">{t("tools.image-cropper.downloadSuccess")}</p>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
