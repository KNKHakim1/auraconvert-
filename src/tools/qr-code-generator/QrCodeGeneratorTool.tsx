"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

export function QrCodeGeneratorTool() {
  const { t } = useTranslations();
  
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  const downloadPng = () => {
    const canvas = document.querySelector("#qr-canvas-container canvas") as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "auraconvert-qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = () => {
    const svg = svgWrapperRef.current?.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "auraconvert-qrcode.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setText("");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Inputs & Settings */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("tools.qr-code-generator.inputLabel")}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("tools.qr-code-generator.inputPlaceholder")}
              className="w-full h-32 p-4 bg-background border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
            {text && (
              <div className="flex justify-end">
                <button
                  onClick={clear}
                  className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Icon name="trash" className="w-4 h-4" />
                  {t("tools.qr-code-generator.clear")}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("tools.qr-code-generator.sizeLabel")}: <span className="text-primary-600 font-bold">{size}px</span>
              </label>
              <input
                type="range"
                min="128"
                max="1024"
                step="8"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("tools.qr-code-generator.levelLabel")}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
              >
                <option value="L">{t("tools.qr-code-generator.levelL")}</option>
                <option value="M">{t("tools.qr-code-generator.levelM")}</option>
                <option value="Q">{t("tools.qr-code-generator.levelQ")}</option>
                <option value="H">{t("tools.qr-code-generator.levelH")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Preview & Download */}
        <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-secondary/30 rounded-2xl border border-border/50">
          {text ? (
            <div className="flex flex-col items-center space-y-6 w-full">
              <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-center items-center" id="qr-canvas-container">
                <QRCodeCanvas
                  value={text}
                  size={size}
                  level={level}
                  includeMargin={true}
                  style={{ width: "100%", height: "auto", maxWidth: "250px" }}
                />
              </div>

              {/* Hidden SVG for SVG download */}
              <div ref={svgWrapperRef} className="hidden">
                <QRCodeSVG
                  value={text}
                  size={size}
                  level={level}
                  includeMargin={true}
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button
                  onClick={downloadPng}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Icon name="download" className="w-4 h-4" />
                  {t("tools.qr-code-generator.downloadPng")}
                </button>
                <button
                  onClick={downloadSvg}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-border text-foreground font-semibold rounded-xl hover:bg-secondary/50 transition-all shadow-sm"
                >
                  <Icon name="download" className="w-4 h-4" />
                  {t("tools.qr-code-generator.downloadSvg")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3 h-[250px]">
              <Icon name="qr-code" className="w-16 h-16 opacity-20" />
              <p className="text-sm font-medium">{t("tools.qr-code-generator.emptyState")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.qr-code-generator.securityWarning")}</p>
      </div>
    </div>
  );
}
