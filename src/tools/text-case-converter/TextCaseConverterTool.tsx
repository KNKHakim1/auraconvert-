"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

type CaseType = 
  | "uppercase" 
  | "lowercase" 
  | "titleCase" 
  | "sentenceCase" 
  | "camelCase" 
  | "pascalCase" 
  | "snakeCase" 
  | "kebabCase" 
  | "toggleCase";

export function TextCaseConverterTool() {
  const { t, locale } = useTranslations();
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("uppercase");
  const [isCopied, setIsCopied] = useState(false);

  const loc = locale === "tr" ? "tr-TR" : "en-US";

  const convertText = (text: string, type: CaseType): string => {
    if (!text) return "";

    const words = text.split(/[\s_-]+/);
    const nonWordCharsRegex = /[^\p{L}\p{N}]+/gu;

    switch (type) {
      case "uppercase":
        return text.toLocaleUpperCase(loc);

      case "lowercase":
        return text.toLocaleLowerCase(loc);

      case "titleCase":
        return text
          .toLocaleLowerCase(loc)
          .replace(/(?:^|\s)\S/g, (a) => a.toLocaleUpperCase(loc));

      case "sentenceCase":
        return text
          .toLocaleLowerCase(loc)
          .replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (a) => a.toLocaleUpperCase(loc));

      case "camelCase":
        return text
          .replace(nonWordCharsRegex, " ")
          .split(/\s+/)
          .filter(Boolean)
          .map((word, index) => {
            if (index === 0) return word.toLocaleLowerCase(loc);
            return (
              word.charAt(0).toLocaleUpperCase(loc) +
              word.slice(1).toLocaleLowerCase(loc)
            );
          })
          .join("");

      case "pascalCase":
        return text
          .replace(nonWordCharsRegex, " ")
          .split(/\s+/)
          .filter(Boolean)
          .map(
            (word) =>
              word.charAt(0).toLocaleUpperCase(loc) +
              word.slice(1).toLocaleLowerCase(loc)
          )
          .join("");

      case "snakeCase":
        return text
          .replace(nonWordCharsRegex, " ")
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => word.toLocaleLowerCase(loc))
          .join("_");

      case "kebabCase":
        return text
          .replace(nonWordCharsRegex, " ")
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => word.toLocaleLowerCase(loc))
          .join("-");

      case "toggleCase":
        return text
          .split("")
          .map((c) => {
            const up = c.toLocaleUpperCase(loc);
            const low = c.toLocaleLowerCase(loc);
            return c === up ? low : up;
          })
          .join("");

      default:
        return text;
    }
  };

  const output = useMemo(() => convertText(input, activeCase), [input, activeCase, loc]);

  const stats = useMemo(() => {
    const chars = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
    return t("tools.text-case-converter.stats")
      .replace("{{chars}}", chars.toString())
      .replace("{{words}}", words.toString())
      .replace("{{lines}}", lines.toString());
  }, [input, t]);

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
    a.download = `auraconvert-${activeCase}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const caseOptions: { id: CaseType; labelKey: string }[] = [
    { id: "uppercase", labelKey: "uppercase" },
    { id: "lowercase", labelKey: "lowercase" },
    { id: "titleCase", labelKey: "titleCase" },
    { id: "sentenceCase", labelKey: "sentenceCase" },
    { id: "camelCase", labelKey: "camelCase" },
    { id: "pascalCase", labelKey: "pascalCase" },
    { id: "snakeCase", labelKey: "snakeCase" },
    { id: "kebabCase", labelKey: "kebabCase" },
    { id: "toggleCase", labelKey: "toggleCase" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {t("tools.text-case-converter.inputLabel")}
            </label>
            <div className="flex gap-2">
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                >
                  {t("tools.text-case-converter.clear")}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("tools.text-case-converter.inputPlaceholder")}
            className="w-full h-64 p-4 bg-background border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
          />
          <p className="text-xs text-muted-foreground">{stats}</p>
        </div>

        {/* Output Column */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {t("tools.text-case-converter.outputLabel")}
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
                {isCopied ? t("tools.text-case-converter.copied") : t("tools.text-case-converter.copy")}
              </button>
              <button
                onClick={downloadTxt}
                disabled={!output}
                className="text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="download" className="w-3 h-3" />
                {t("tools.text-case-converter.downloadTxt")}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t("tools.text-case-converter.outputPlaceholder")}
            className="w-full h-64 p-4 bg-secondary/30 border border-border rounded-xl resize-none outline-none text-foreground shadow-sm"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {caseOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveCase(opt.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                activeCase === opt.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:border-primary-400 hover:bg-secondary"
              )}
            >
              {t(`tools.text-case-converter.cases.${opt.labelKey}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.text-case-converter.securityWarning")}</p>
      </div>
    </div>
  );
}
