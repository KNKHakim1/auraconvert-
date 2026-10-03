"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

// Utility conversion functions
const hexToRgbVals = (hex: string): [number, number, number] | null => {
  let cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) return null;

  const num = parseInt(cleanHex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
};

const rgbValsToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
};

const rgbValsToHslVals = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslValsToRgbVals = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export function ColorConverterTool() {
  const { t } = useTranslations();

  // State holds the exact strings in inputs to allow free typing
  const [hexInput, setHexInput] = useState("#000000");
  const [rgbInput, setRgbInput] = useState("rgb(0, 0, 0)");
  const [hslInput, setHslInput] = useState("hsl(0, 0%, 0%)");
  
  // To avoid circular updates
  const [lastEdited, setLastEdited] = useState<"hex" | "rgb" | "hsl" | "picker" | null>(null);

  // Background color preview
  const [previewHex, setPreviewHex] = useState("#000000");
  
  // Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const updateAllFromRgb = useCallback((r: number, g: number, b: number, source: string) => {
    // Clamp values
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));

    const newHex = rgbValsToHex(r, g, b);
    const [h, s, l] = rgbValsToHslVals(r, g, b);

    if (source !== "hex") setHexInput(newHex);
    if (source !== "rgb") setRgbInput(`rgb(${r}, ${g}, ${b})`);
    if (source !== "hsl") setHslInput(`hsl(${h}, ${s}%, ${l}%)`);
    
    setPreviewHex(newHex);
  }, []);

  // Parse HEX
  useEffect(() => {
    if (lastEdited !== "hex") return;
    const vals = hexToRgbVals(hexInput);
    if (vals) updateAllFromRgb(vals[0], vals[1], vals[2], "hex");
  }, [hexInput, lastEdited, updateAllFromRgb]);

  // Parse RGB
  useEffect(() => {
    if (lastEdited !== "rgb") return;
    const match = rgbInput.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
    if (match) {
      updateAllFromRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), "rgb");
    }
  }, [rgbInput, lastEdited, updateAllFromRgb]);

  // Parse HSL
  useEffect(() => {
    if (lastEdited !== "hsl") return;
    const match = hslInput.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/i);
    if (match) {
      let h = parseInt(match[1]);
      let s = parseInt(match[2]);
      let l = parseInt(match[3]);
      h = h % 360;
      s = Math.min(100, Math.max(0, s));
      l = Math.min(100, Math.max(0, l));
      const [r, g, b] = hslValsToRgbVals(h, s, l);
      updateAllFromRgb(r, g, b, "hsl");
    }
  }, [hslInput, lastEdited, updateAllFromRgb]);

  // Picker change
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastEdited("picker");
    setHexInput(e.target.value);
    const vals = hexToRgbVals(e.target.value);
    if(vals) updateAllFromRgb(vals[0], vals[1], vals[2], "picker");
  };

  const generateRandomColor = () => {
    setLastEdited("picker");
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = rgbValsToHex(r, g, b);
    setHexInput(hex);
    updateAllFromRgb(r, g, b, "picker");
  };

  const handleReset = () => {
    setLastEdited("picker");
    setHexInput("#000000");
    updateAllFromRgb(0, 0, 0, "picker");
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Determine if inputs are valid to show invalid state
  const isHexValid = !!hexToRgbVals(hexInput);
  const isRgbValid = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i.test(rgbInput);
  const isHslValid = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*[\d.]+\s*)?\)$/i.test(hslInput);

  return (
    <div className="space-y-8">
      {/* Top Preview Area */}
      <div className="flex flex-col md:flex-row gap-6">
        <div 
          className="flex-1 h-48 md:h-64 rounded-3xl shadow-inner border border-border/10 flex items-end justify-end p-4 transition-colors duration-200"
          style={{ backgroundColor: previewHex }}
        >
          {/* Custom styled color picker to look good in the corner */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-white/20 bg-black/10 backdrop-blur-md">
            <input 
              type="color" 
              value={previewHex} 
              onChange={handlePickerChange}
              className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
              title={t("tools.color-converter.pickerLabel")}
            />
            <div className="px-4 py-2 font-mono font-bold text-white drop-shadow-md flex items-center gap-2 pointer-events-none">
              <Icon name="palette" className="w-4 h-4" />
              {previewHex.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-row md:flex-col gap-3 justify-center">
          <button
            onClick={generateRandomColor}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
          >
            <Icon name="refresh" className="w-5 h-5" />
            <span className="hidden sm:inline">{t("tools.color-converter.randomColor")}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-all shadow-sm border border-border"
          >
            <Icon name="trash" className="w-5 h-5" />
            <span className="hidden sm:inline">{t("tools.color-converter.reset")}</span>
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* HEX Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              {t("tools.color-converter.hexLabel")}
            </label>
            {!isHexValid && (
              <span className="text-xs text-destructive font-semibold">
                {t("tools.color-converter.invalidColor")}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => { setLastEdited("hex"); setHexInput(e.target.value); }}
              placeholder={t("tools.color-converter.hexPlaceholder")}
              className={cn(
                "w-full p-3 pr-12 bg-background border rounded-xl font-mono text-sm outline-none transition-all shadow-sm focus:ring-2",
                isHexValid ? "border-border focus:border-primary-500 focus:ring-primary-500" : "border-destructive focus:ring-destructive/20"
              )}
            />
            <button
              onClick={() => copyToClipboard(hexInput, "hex")}
              className="absolute right-2 p-2 text-muted-foreground hover:text-primary transition-colors"
              title={t("tools.color-converter.copy")}
            >
              <Icon name={copiedField === "hex" ? "check" : "copy"} className={cn("w-4 h-4", copiedField === "hex" && "text-green-500")} />
            </button>
          </div>
        </div>

        {/* RGB Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              {t("tools.color-converter.rgbLabel")}
            </label>
            {!isRgbValid && (
              <span className="text-xs text-destructive font-semibold">
                {t("tools.color-converter.invalidColor")}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={rgbInput}
              onChange={(e) => { setLastEdited("rgb"); setRgbInput(e.target.value); }}
              placeholder={t("tools.color-converter.rgbPlaceholder")}
              className={cn(
                "w-full p-3 pr-12 bg-background border rounded-xl font-mono text-sm outline-none transition-all shadow-sm focus:ring-2",
                isRgbValid ? "border-border focus:border-primary-500 focus:ring-primary-500" : "border-destructive focus:ring-destructive/20"
              )}
            />
            <button
              onClick={() => copyToClipboard(rgbInput, "rgb")}
              className="absolute right-2 p-2 text-muted-foreground hover:text-primary transition-colors"
              title={t("tools.color-converter.copy")}
            >
              <Icon name={copiedField === "rgb" ? "check" : "copy"} className={cn("w-4 h-4", copiedField === "rgb" && "text-green-500")} />
            </button>
          </div>
        </div>

        {/* HSL Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              {t("tools.color-converter.hslLabel")}
            </label>
            {!isHslValid && (
              <span className="text-xs text-destructive font-semibold">
                {t("tools.color-converter.invalidColor")}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={hslInput}
              onChange={(e) => { setLastEdited("hsl"); setHslInput(e.target.value); }}
              placeholder={t("tools.color-converter.hslPlaceholder")}
              className={cn(
                "w-full p-3 pr-12 bg-background border rounded-xl font-mono text-sm outline-none transition-all shadow-sm focus:ring-2",
                isHslValid ? "border-border focus:border-primary-500 focus:ring-primary-500" : "border-destructive focus:ring-destructive/20"
              )}
            />
            <button
              onClick={() => copyToClipboard(hslInput, "hsl")}
              className="absolute right-2 p-2 text-muted-foreground hover:text-primary transition-colors"
              title={t("tools.color-converter.copy")}
            >
              <Icon name={copiedField === "hsl" ? "check" : "copy"} className={cn("w-4 h-4", copiedField === "hsl" && "text-green-500")} />
            </button>
          </div>
        </div>

      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 mt-4">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.color-converter.securityWarning")}</p>
      </div>

    </div>
  );
}
