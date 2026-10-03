"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Dropzone } from "@/components/ui/Dropzone";
import { Icon } from "@/components/icons/Icon";

export function WatermarkRemoverTool() {
  const { t } = useTranslations();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCvReady, setIsCvReady] = useState(false);

  // References for drawing mechanism
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Paths state for Undo functionality
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);

  type Point = { x: number; y: number };
  type PathData = { size: number; points: Point[] };

  useEffect(() => {
    // Check if script is already loaded (in case of fast navigation)
    if (typeof window !== "undefined" && (window as any).cv) {
      setIsCvReady(true);
    }
  }, []);

  const handleFile = (newFile: File) => {
    // Reset state
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    
    setFile(newFile);
    setOriginalUrl(URL.createObjectURL(newFile));
    setOutputUrl(null);
    setPaths([]);
    setCurrentPath(null);
  };

  const clearFile = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setOriginalUrl(null);
    setOutputUrl(null);
    setPaths([]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates based on actual image size vs displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setCurrentPath({ size: brushSize, points: [coords] });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    setCurrentPath((prev) => {
      if (!prev) return null;
      return { ...prev, points: [...prev.points, coords] };
    });
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath) {
      setPaths((prev) => [...prev, currentPath]);
    }
    setIsDrawing(false);
    setCurrentPath(null);
  };

  const undo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const clearMask = () => {
    setPaths([]);
  };

  // Redraw all paths whenever paths or currentPath change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set line styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red for mask

    const allPaths = [...paths];
    if (currentPath) allPaths.push(currentPath);

    allPaths.forEach((path) => {
      if (path.points.length === 0) return;
      ctx.lineWidth = path.size;
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, [paths, currentPath]);

  // Adjust canvas size to match the loaded image's intrinsic size
  const onImageLoad = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
  };

  const processInpainting = async () => {
    if (!imageRef.current || !canvasRef.current || !file || paths.length === 0) return;
    
    setIsProcessing(true);

    try {
      // Small delay to allow React to render loading state
      await new Promise(resolve => setTimeout(resolve, 50));

      const imgElement = imageRef.current;
      const maskCanvas = canvasRef.current;

      // 0. Resolve cv if it's a promise
      let cv = (window as any).cv;
      if (cv instanceof Promise) {
        cv = await cv;
      }
      
      // 1. Read source image and mask into OpenCV Mat
      let src = cv.imread(imgElement);
      let mask = cv.imread(maskCanvas);

      // Convert src from RGBA (4-channel) to RGB (3-channel) because inpaint doesn't support RGBA
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);

      // 2. Convert mask to single channel (grayscale)
      cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY, 0);

      // 3. Create destination Mat
      let dst = new cv.Mat();

      // 4. Inpaint (TELEA algorithm)
      // Radius parameter: neighborhood size for inpainting
      cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA);

      // 5. Draw the result to a temporary canvas to extract Blob
      const outCanvas = document.createElement("canvas");
      outCanvas.width = src.cols;
      outCanvas.height = src.rows;
      cv.imshow(outCanvas, dst);

      // We preserve the original file type (fallback to png if needed)
      let outType = file.type;
      if (outType !== "image/jpeg" && outType !== "image/png" && outType !== "image/webp") {
        outType = "image/png";
      }

      const outBlob = await new Promise<Blob | null>((resolve) => {
        outCanvas.toBlob(resolve, outType, 0.95);
      });

      if (!outBlob) throw new Error("Could not generate output image.");

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(outBlob));

      // Cleanup OpenCV resources to prevent memory leaks
      src.delete();
      mask.delete();
      dst.delete();

    } catch (error) {
      console.error("Inpainting error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getDownloadFilename = () => {
    if (!file) return "auraconvert-watermark-removed.png";
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.substring(file.name.lastIndexOf('.')) || ".png";
    return `auraconvert-watermark-removed-${nameWithoutExt}${ext}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("tools.watermark-remover.name")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {t("tools.watermark-remover.description")}
        </p>
      </div>
      
      {/* Load OpenCV.js dynamically to avoid SSR issues and keep bundle size small */}
      <script 
        src="/opencv/opencv.js" 
        async 
        onLoad={() => setIsCvReady(true)}
      />

      {!file ? (
        <Dropzone
          onFileSelect={handleFile}
          accept="image/jpeg, image/png, image/webp"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border rounded-lg p-4">
            
            {/* Toolbar */}
            <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
              {/* Brush Size */}
              <div className="flex items-center gap-2">
                <Icon name="palette" className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fırça:</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-24 accent-primary"
                  disabled={!!outputUrl || isProcessing}
                />
              </div>
              
              <div className="h-6 w-px bg-border hidden sm:block"></div>
              
              <button
                onClick={undo}
                disabled={paths.length === 0 || !!outputUrl || isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
                Geri Al
              </button>
              
              <button
                onClick={clearMask}
                disabled={paths.length === 0 || !!outputUrl || isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50 transition-colors"
              >
                <Icon name="close" className="w-4 h-4" />
                Temizle
              </button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={clearFile}
                className="w-full sm:w-auto px-4 py-2 border bg-background hover:bg-secondary text-sm font-medium rounded-md transition-colors"
              >
                İptal
              </button>
              {!outputUrl ? (
                <button
                  onClick={processInpainting}
                  disabled={isProcessing || !isCvReady || paths.length === 0}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-md disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      İşleniyor...
                    </>
                  ) : !isCvReady ? (
                    "Model Yükleniyor..."
                  ) : (
                    "Sil"
                  )}
                </button>
              ) : (
                <a
                  href={outputUrl}
                  download={getDownloadFilename()}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="download" className="w-4 h-4" />
                  İndir
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Workspace */}
            <div className="flex-1 bg-secondary/50 rounded-lg border p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <div 
                ref={containerRef}
                className="relative cursor-crosshair max-w-full touch-none select-none"
                onMouseDown={!outputUrl ? startDrawing : undefined}
                onMouseMove={!outputUrl ? draw : undefined}
                onMouseUp={!outputUrl ? stopDrawing : undefined}
                onMouseLeave={!outputUrl ? stopDrawing : undefined}
                onTouchStart={!outputUrl ? startDrawing : undefined}
                onTouchMove={!outputUrl ? draw : undefined}
                onTouchEnd={!outputUrl ? stopDrawing : undefined}
              >
                {/* Original Image */}
                <img
                  ref={imageRef}
                  src={originalUrl!}
                  alt="Original"
                  className="max-h-[60vh] object-contain select-none pointer-events-none"
                  draggable={false}
                  onLoad={onImageLoad}
                />
                
                {/* Drawing Canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className={`absolute top-0 left-0 w-full h-full object-contain pointer-events-none ${outputUrl ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* Result overlay */}
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Result"
                    className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
            <Icon name="info" className="w-5 h-5 shrink-0" />
            <p>
              İstenmeyen nesnenin üzerini fırça ile işaretleyin ve "Sil" butonuna tıklayın. 
              İşlem cihazınızda yerel olarak yapılır, resimleriniz hiçbir sunucuya yüklenmez.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
