"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function ImageRotatorTool() {
  const { t } = useTranslations();
  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Transform state
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  
  // Image data
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  
  // Output state
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/png");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    setError(null);
    setFile(null);
    setImgSrc(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError(t("tools.image-rotator.invalidImage"));
      return;
    }

    setFile(selected);
    if (selected.type === "image/jpeg") setFormat("image/jpeg");
    else if (selected.type === "image/webp") setFormat("image/webp");
    else setFormat("image/png");

    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target?.result as string);
    };
    reader.readAsDataURL(selected);
  };

  useEffect(() => {
    if (imgSrc && imgRef.current) {
      imgRef.current.onload = () => {
        setOrigWidth(imgRef.current!.naturalWidth);
        setOrigHeight(imgRef.current!.naturalHeight);
        drawToCanvas();
      };
    }
  }, [imgSrc]);

  useEffect(() => {
    if (imgSrc) drawToCanvas();
  }, [rotation, flipH, flipV]);

  const drawToCanvas = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate dimensions based on rotation
    const isRotated = rotation % 180 !== 0;
    canvas.width = isRotated ? origHeight : origWidth;
    canvas.height = isRotated ? origWidth : origHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    
    ctx.drawImage(img, -origWidth / 2, -origHeight / 2, origWidth, origHeight);
  };

  const handleRotateRight = () => setRotation(r => (r + 90) % 360);
  const handleRotateLeft = () => setRotation(r => (r - 90 + 360) % 360);
  const handleRotate180 = () => setRotation(r => (r + 180) % 360);
  const handleFlipH = () => setFlipH(f => !f);
  const handleFlipV = () => setFlipV(f => !f);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const dataUrl = canvas.toDataURL(format, 0.92);
    
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `auraconvert-rotated.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clear = () => {
    setFile(null);
    setImgSrc(null);
    setError(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentW = rotation % 180 !== 0 ? origHeight : origWidth;
  const currentH = rotation % 180 !== 0 ? origWidth : origHeight;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {!file && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-background border-2 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group min-h-[300px]"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon name="rotate-cw" className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("tools.image-rotator.upload")}</h3>
          <p className="text-muted-foreground">{t("tools.image-rotator.dragDrop")}</p>
        </div>
      )}

      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center gap-3 font-medium">
          <Icon name="alert-circle" className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {imgSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          
          <div className="lg:col-span-2 bg-background border border-border rounded-3xl p-6 shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden bg-[url('/pattern-grid.svg')] dark:bg-[url('/pattern-grid-dark.svg')]">
            <img src={imgSrc} ref={imgRef} className="hidden" alt="original" />
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[60vh] object-contain shadow-lg rounded-md"
            />
          </div>

          <div className="bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            
            <div className="space-y-3">
              <h3 className="font-semibold">{t("tools.image-rotator.rotateRight").split('(')[0]}</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleRotateLeft} className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors flex flex-col items-center gap-2">
                  <Icon name="rotate-ccw" className="w-5 h-5" />
                  <span className="text-xs font-medium">-90°</span>
                </button>
                <button onClick={handleRotateRight} className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors flex flex-col items-center gap-2">
                  <Icon name="rotate-cw" className="w-5 h-5" />
                  <span className="text-xs font-medium">+90°</span>
                </button>
                <button onClick={handleRotate180} className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors flex flex-col items-center gap-2 col-span-2">
                  <Icon name="rotate-cw" className="w-5 h-5 opacity-50" />
                  <span className="text-xs font-medium">180°</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">{t("tools.image-rotator.flipHorizontal").split(' ')[0]}</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleFlipH} className={cn("p-3 rounded-xl transition-colors flex flex-col items-center gap-2 border border-border", flipH ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/50 hover:bg-secondary")}>
                  <Icon name="arrow-right-left" className="w-5 h-5" />
                  <span className="text-xs font-medium">{t("tools.image-rotator.flipHorizontal")}</span>
                </button>
                <button onClick={handleFlipV} className={cn("p-3 rounded-xl transition-colors flex flex-col items-center gap-2 border border-border", flipV ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/50 hover:bg-secondary")}>
                  <Icon name="arrow-down-up" className="w-5 h-5" />
                  <span className="text-xs font-medium">{t("tools.image-rotator.flipVertical")}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("tools.image-rotator.originalSize")}</span>
                <span className="font-medium">{origWidth} × {origHeight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("tools.image-rotator.newSize")}</span>
                <span className="font-bold text-primary">{currentW} × {currentH}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3 mt-auto">
              <label className="text-sm font-semibold">{t("tools.image-rotator.format")}</label>
              <select 
                value={format} 
                onChange={(e: any) => setFormat(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={downloadImage} className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
                <Icon name="download" className="w-5 h-5" />
                {t("tools.image-rotator.download")}
              </button>
              <button onClick={clear} className="px-4 py-3 bg-destructive/10 text-destructive font-bold rounded-xl flex items-center justify-center hover:bg-destructive/20 transition-all active:scale-95" title={t("tools.image-rotator.clear")}>
                <Icon name="trash" className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
