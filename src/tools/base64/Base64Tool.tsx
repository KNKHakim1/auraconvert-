"use client";

import React, { useState, useMemo, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function Base64Tool() {
  const { t } = useTranslations();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unicode-safe encode
  const utf8ToBase64 = (str: string): string => {
    try {
      const utf8Bytes = new TextEncoder().encode(str);
      let binaryString = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
      }
      return btoa(binaryString);
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  // Unicode-safe decode
  const base64ToUtf8 = (str: string): string => {
    try {
      // Clean up the string by removing whitespaces (common in copied base64)
      const cleanStr = str.replace(/\s+/g, '');
      const binaryString = atob(cleanStr);
      const utf8Bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        utf8Bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder("utf-8", { fatal: true }).decode(utf8Bytes);
    } catch (e) {
      throw new Error("Invalid Base64");
    }
  };

  const output = useMemo(() => {
    setError(null);
    if (!input) return "";

    if (mode === "encode") {
      return utf8ToBase64(input);
    } else {
      try {
        return base64ToUtf8(input);
      } catch (err) {
        setError(t("tools.base64.errorInvalidBase64"));
        return "";
      }
    }
  }, [input, mode, t]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const downloadTxt = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auraconvert-base64-${mode}d.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(content);
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = "";
  };

  const inputStats = t("tools.base64.stats").replace("{{chars}}", input.length.toString());
  const outputStats = t("tools.base64.stats").replace("{{chars}}", output.length.toString());

  return (
    <div className="space-y-6">
      
      {/* Mode Switcher */}
      <div className="flex bg-secondary/50 p-1 rounded-xl w-full sm:w-fit border border-border">
        <button
          onClick={() => { setMode("encode"); setError(null); }}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
            mode === "encode"
              ? "bg-background text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t("tools.base64.encodeMode")}
        </button>
        <button
          onClick={() => { setMode("decode"); setError(null); }}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
            mode === "decode"
              ? "bg-background text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t("tools.base64.decodeMode")}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-xl text-sm font-medium flex items-center gap-3">
          <Icon name="info" className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {t("tools.base64.inputLabel")}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                <Icon name="upload" className="w-3 h-3" />
                {t("tools.base64.uploadTxt")}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt" 
                className="hidden" 
              />
              
              {input && (
                <button
                  onClick={() => { setInput(""); setError(null); }}
                  className="text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                >
                  {t("tools.base64.clear")}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? t("tools.base64.inputPlaceholderEncode") : t("tools.base64.inputPlaceholderDecode")}
            className={cn(
              "w-full h-64 p-4 bg-background border rounded-xl resize-none outline-none transition-all shadow-sm focus:ring-2",
              error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border focus:border-primary-500 focus:ring-primary-500"
            )}
          />
          <p className="text-xs text-muted-foreground">{inputStats}</p>
        </div>

        {/* Output Column */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {t("tools.base64.outputLabel")}
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1",
                  isCopied
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Icon name={isCopied ? "check" : "copy"} className="w-3 h-3" />
                {isCopied ? t("tools.base64.copied") : t("tools.base64.copy")}
              </button>
              <button
                onClick={downloadTxt}
                disabled={!output}
                className="text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="download" className="w-3 h-3" />
                {t("tools.base64.downloadTxt")}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t("tools.base64.outputPlaceholder")}
            className="w-full h-64 p-4 bg-secondary/30 border border-border rounded-xl resize-none outline-none text-foreground shadow-sm"
          />
          <p className="text-xs text-muted-foreground">{outputStats}</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.base64.securityWarning")}</p>
      </div>
    </div>
  );
}
