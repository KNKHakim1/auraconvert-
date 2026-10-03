"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function TextCleanerTool() {
  const { t } = useTranslations();
  
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  // Options
  const [trim, setTrim] = useState(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [collapseEmptyLines, setCollapseEmptyLines] = useState(true);
  const [tabsToSpaces, setTabsToSpaces] = useState(true);
  const [normalizeLineEndings, setNormalizeLineEndings] = useState(true);
  const [caseFormat, setCaseFormat] = useState<"original" | "lower" | "upper">("original");

  useEffect(() => {
    let res = input;

    if (normalizeLineEndings) {
      res = res.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }
    
    if (tabsToSpaces) {
      res = res.replace(/\t/g, "    ");
    }

    if (removeEmptyLines) {
      res = res.split("\n").filter(line => line.trim().length > 0).join("\n");
    } else if (collapseEmptyLines) {
      res = res.replace(/\n\s*\n\s*\n/g, "\n\n");
    }

    if (removeExtraSpaces) {
      res = res.split("\n").map(line => line.replace(/ +/g, " ")).join("\n");
    }

    if (trim) {
      res = res.split("\n").map(line => line.trim()).join("\n");
      res = res.trim(); // Trim whole document
    }

    if (caseFormat === "lower") {
      res = res.toLocaleLowerCase();
    } else if (caseFormat === "upper") {
      res = res.toLocaleUpperCase();
    }

    setOutput(res);
  }, [input, trim, removeExtraSpaces, removeEmptyLines, collapseEmptyLines, tabsToSpaces, normalizeLineEndings, caseFormat]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "auraconvert-cleaned.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const charCount = output.length;
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Options Sidebar */}
      <div className="w-full lg:w-80 shrink-0 bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.trimSpaces")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={removeExtraSpaces} onChange={e => setRemoveExtraSpaces(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.removeExtraSpaces")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={removeEmptyLines} onChange={e => {setRemoveEmptyLines(e.target.checked); if(e.target.checked) setCollapseEmptyLines(false);}} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.removeEmptyLines")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={collapseEmptyLines} onChange={e => {setCollapseEmptyLines(e.target.checked); if(e.target.checked) setRemoveEmptyLines(false);}} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.collapseEmptyLines")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={tabsToSpaces} onChange={e => setTabsToSpaces(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.tabsToSpaces")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={normalizeLineEndings} onChange={e => setNormalizeLineEndings(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{t("tools.text-cleaner.normalizeLineEndings")}</span>
          </label>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <label className="text-sm font-bold text-muted-foreground">{t("tools.text-cleaner.caseSelector")}</label>
          <select 
            value={caseFormat} 
            onChange={(e: any) => setCaseFormat(e.target.value)}
            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary"
          >
            <option value="original">{t("tools.text-cleaner.caseOriginal")}</option>
            <option value="lower">{t("tools.text-cleaner.caseLower")}</option>
            <option value="upper">{t("tools.text-cleaner.caseUpper")}</option>
          </select>
        </div>

      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder={t("tools.text-cleaner.pasteText")}
            className="w-full h-[300px] md:h-[500px] p-5 bg-background border border-border rounded-3xl resize-none outline-none focus:border-primary transition-colors font-medium shadow-sm"
          />
          <div className="relative">
            <textarea 
              readOnly 
              value={output} 
              className="w-full h-[300px] md:h-[500px] p-5 bg-primary/5 border border-primary/20 rounded-3xl resize-none outline-none text-foreground font-medium shadow-sm"
            />
            {output && (
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-black/50 backdrop-blur rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-muted-foreground"
                title={t("tools.text-cleaner.copy")}
              >
                {showCopied ? <Icon name="check" className="w-5 h-5" /> : <Icon name="copy" className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        <div className="bg-background border border-border rounded-3xl p-4 md:px-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium">
              <span className="text-muted-foreground">{t("tools.text-cleaner.charCount")}: </span>
              <span className="font-bold">{charCount}</span>
            </div>
            <div className="text-sm font-medium">
              <span className="text-muted-foreground">{t("tools.text-cleaner.wordCount")}: </span>
              <span className="font-bold">{wordCount}</span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={downloadTxt} disabled={!output} className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-sm">
              <Icon name="download" className="w-5 h-5" />
              {t("tools.text-cleaner.downloadTxt")}
            </button>
            <button onClick={clear} disabled={!input} className="px-4 py-2.5 bg-destructive/10 text-destructive font-bold rounded-xl flex items-center justify-center hover:bg-destructive/20 transition-all active:scale-95 disabled:opacity-50">
              <Icon name="trash" className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
