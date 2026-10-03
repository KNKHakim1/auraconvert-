"use client";

import React, { useState, useMemo, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function UrlEncoderTool() {
  const { t } = useTranslations();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    setError(null);
    if (!input) return "";

    if (mode === "encode") {
      try {
        return encodeURIComponent(input);
      } catch (err) {
        setError(t("tools.url-encoder.errorInvalidUrl"));
        return "";
      }
    } else {
      try {
        return decodeURIComponent(input);
      } catch (err) {
        setError(t("tools.url-encoder.errorInvalidUrl"));
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
    a.download = `auraconvert-url-${mode}d.txt`;
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
      if (content !== undefined) {
        setInput(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const inputStats = t("tools.url-encoder.stats").replace("{{chars}}", input.length.toString());
  const outputStats = t("tools.url-encoder.stats").replace("{{chars}}", output.length.toString());

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
          {t("tools.url-encoder.encodeMode")}
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
          {t("tools.url-encoder.decodeMode")}
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
              {t("tools.url-encoder.inputLabel")}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                <Icon name="upload" className="w-3 h-3" />
                {t("tools.url-encoder.uploadTxt")}
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
                  {t("tools.url-encoder.clear")}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? t("tools.url-encoder.inputPlaceholderEncode") : t("tools.url-encoder.inputPlaceholderDecode")}
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
              {t("tools.url-encoder.outputLabel")}
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
                {isCopied ? t("tools.url-encoder.copied") : t("tools.url-encoder.copy")}
              </button>
              <button
                onClick={downloadTxt}
                disabled={!output}
                className="text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="download" className="w-3 h-3" />
                {t("tools.url-encoder.downloadTxt")}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t("tools.url-encoder.outputPlaceholder")}
            className="w-full h-64 p-4 bg-secondary/30 border border-border rounded-xl resize-none outline-none text-foreground shadow-sm"
          />
          <p className="text-xs text-muted-foreground">{outputStats}</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.url-encoder.securityWarning")}</p>
      </div>
    </div>
  );
}
