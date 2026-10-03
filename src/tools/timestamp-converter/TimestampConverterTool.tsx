"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function TimestampConverterTool() {
  const { t } = useTranslations();
  
  // Current Time state
  const [currentTsMs, setCurrentTsMs] = useState(Date.now());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Timezone (Client-side only)
  const [timeZone, setTimeZone] = useState<string>("");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const interval = setInterval(() => setCurrentTsMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // TS to Date state
  const [tsInput, setTsInput] = useState<string>("");
  const [tsUnit, setTsUnit] = useState<"s" | "ms">("s");

  // Date to TS state
  // We use datetime-local which uses format YYYY-MM-DDThh:mm
  const [dateInput, setDateInput] = useState<string>("");

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // ----- 1. Timestamp to Date Logic -----
  const tsToDateResult = useMemo(() => {
    if (!tsInput.trim()) return null;
    const num = Number(tsInput.trim());
    if (isNaN(num)) return { error: t("tools.timestamp-converter.invalidTs") };

    const ms = tsUnit === "s" ? num * 1000 : num;
    const date = new Date(ms);

    if (isNaN(date.getTime())) return { error: t("tools.timestamp-converter.invalidTs") };

    return {
      utc: date.toUTCString(),
      local: date.toString(),
      iso: date.toISOString(),
    };
  }, [tsInput, tsUnit, t]);

  // ----- 2. Date to Timestamp Logic -----
  const dateToTsResult = useMemo(() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return { error: t("tools.timestamp-converter.invalidDate") };

    const ms = date.getTime();
    return {
      s: Math.floor(ms / 1000).toString(),
      ms: ms.toString()
    };
  }, [dateInput, t]);

  const handleSetNow = () => {
    const now = new Date();
    // datetime-local format: YYYY-MM-DDTHH:mm:ss.SSS (browser dependent, let's format safely)
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, -1);
    // remove seconds/milliseconds for standard input compat if needed, but keeping seconds is fine
    setDateInput(localISOTime.substring(0, 16)); 
  };

  return (
    <div className="space-y-8">
      
      {/* Current Timestamp Panel */}
      <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("tools.timestamp-converter.currentTimestamp")}
          </h2>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-bold text-foreground tracking-tight">
                {Math.floor(currentTsMs / 1000)}
              </span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {t("tools.timestamp-converter.seconds")}
              </span>
              <button 
                onClick={() => copyToClipboard(Math.floor(currentTsMs / 1000).toString(), "curr-s")}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                title={t("tools.timestamp-converter.copy")}
              >
                <Icon name={copiedField === "curr-s" ? "check" : "copy"} className={cn("w-4 h-4", copiedField === "curr-s" && "text-green-500")} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-mono text-muted-foreground tracking-tight">
                {currentTsMs}
              </span>
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border">
                {t("tools.timestamp-converter.milliseconds")}
              </span>
              <button 
                onClick={() => copyToClipboard(currentTsMs.toString(), "curr-ms")}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                title={t("tools.timestamp-converter.copy")}
              >
                <Icon name={copiedField === "curr-ms" ? "check" : "copy"} className={cn("w-4 h-4", copiedField === "curr-ms" && "text-green-500")} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground w-full md:w-auto">
          {timeZone && (
            <div className="flex items-center gap-2">
              <Icon name="clock" className="w-4 h-4" />
              <span>{t("tools.timestamp-converter.timezone")} <strong className="text-foreground">{timeZone}</strong></span>
            </div>
          )}
          <button 
            onClick={() => setCurrentTsMs(Date.now())}
            className="text-xs font-medium flex items-center gap-1.5 hover:text-primary transition-colors px-3 py-1.5 bg-background border border-border rounded-lg"
          >
            <Icon name="refresh" className="w-3.5 h-3.5" />
            {t("tools.timestamp-converter.refresh")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Converter 1: TS to Date */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="clock" className="w-5 h-5 text-primary" />
              {t("tools.timestamp-converter.tsToDateLabel")}
            </h3>
            {tsInput && (
              <button
                onClick={() => setTsInput("")}
                className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
              >
                {t("tools.timestamp-converter.reset")}
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder={t("tools.timestamp-converter.tsPlaceholder")}
                className="flex-1 p-3 bg-background border border-border rounded-xl font-mono text-sm outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-all"
              />
              <select
                value={tsUnit}
                onChange={(e) => setTsUnit(e.target.value as "s" | "ms")}
                className="p-3 bg-secondary/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="s">{t("tools.timestamp-converter.seconds")}</option>
                <option value="ms">{t("tools.timestamp-converter.milliseconds")}</option>
              </select>
            </div>

            {/* Results */}
            <div className="bg-secondary/20 rounded-xl border border-border/50 p-4 min-h-[140px]">
              {!tsToDateResult ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">
                  {t("tools.timestamp-converter.tsPlaceholder")}
                </div>
              ) : tsToDateResult.error ? (
                <div className="h-full flex items-center gap-2 text-sm text-destructive font-semibold">
                  <Icon name="info" className="w-4 h-4" />
                  {tsToDateResult.error}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.timestamp-converter.utcTime")}</label>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-sm font-mono text-foreground">{tsToDateResult.utc}</code>
                      <button onClick={() => copyToClipboard(tsToDateResult.utc!, "utc")} className="p-1 hover:text-primary transition-colors">
                        <Icon name={copiedField === "utc" ? "check" : "copy"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.timestamp-converter.localTime")}</label>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-sm font-mono text-foreground">{tsToDateResult.local}</code>
                      <button onClick={() => copyToClipboard(tsToDateResult.local!, "local")} className="p-1 hover:text-primary transition-colors">
                        <Icon name={copiedField === "local" ? "check" : "copy"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.timestamp-converter.iso8601")}</label>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-sm font-mono text-foreground">{tsToDateResult.iso}</code>
                      <button onClick={() => copyToClipboard(tsToDateResult.iso!, "iso")} className="p-1 hover:text-primary transition-colors">
                        <Icon name={copiedField === "iso" ? "check" : "copy"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Converter 2: Date to TS */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="clock" className="w-5 h-5 text-primary" />
              {t("tools.timestamp-converter.dateToTsLabel")}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSetNow}
                className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors"
              >
                {t("tools.timestamp-converter.now")}
              </button>
              {dateInput && (
                <button
                  onClick={() => setDateInput("")}
                  className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                >
                  {t("tools.timestamp-converter.reset")}
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <input
                type="datetime-local"
                step="1"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl font-mono text-sm outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-all dark:[color-scheme:dark]"
              />
            </div>

            {/* Results */}
            <div className="bg-secondary/20 rounded-xl border border-border/50 p-4 min-h-[140px] flex flex-col justify-center">
              {!dateToTsResult ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">
                  YYYY-MM-DDThh:mm
                </div>
              ) : dateToTsResult.error ? (
                <div className="h-full flex items-center gap-2 text-sm text-destructive font-semibold">
                  <Icon name="info" className="w-4 h-4" />
                  {dateToTsResult.error}
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.timestamp-converter.seconds")}</label>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-2xl font-mono font-bold text-foreground">{dateToTsResult.s}</code>
                      <button onClick={() => copyToClipboard(dateToTsResult.s!, "s")} className="p-2 hover:text-primary transition-colors bg-background rounded-lg border border-border">
                        <Icon name={copiedField === "s" ? "check" : "copy"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.timestamp-converter.milliseconds")}</label>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-lg font-mono text-muted-foreground">{dateToTsResult.ms}</code>
                      <button onClick={() => copyToClipboard(dateToTsResult.ms!, "ms")} className="p-2 hover:text-primary transition-colors bg-background rounded-lg border border-border">
                        <Icon name={copiedField === "ms" ? "check" : "copy"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
