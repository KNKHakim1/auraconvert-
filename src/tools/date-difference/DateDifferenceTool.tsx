"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function DateDifferenceTool() {
  const { t } = useTranslations();
  
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  
  const [swappedWarning, setSwappedWarning] = useState(false);
  
  // Results
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [workDays, setWorkDays] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);
  const [months, setMonths] = useState<number | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [weeks, setWeeks] = useState<number | null>(null);
  const [remainDays, setRemainDays] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setStart(`${yyyy}-${mm}-${dd}`);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEnd(`${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`);
  }, []);

  const calculate = () => {
    setSwappedWarning(false);
    if (!start || !end) return;

    let d1 = new Date(start);
    let d2 = new Date(end);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

    // Use UTC at midnight to prevent DST shifts affecting day counts
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

    let actual1 = new Date(utc1);
    let actual2 = new Date(utc2);

    if (utc1 > utc2) {
      setSwappedWarning(true);
      const temp = actual1;
      actual1 = actual2;
      actual2 = temp;
    }

    const diffMs = actual2.getTime() - actual1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    setTotalDays(diffDays);
    setWeeks(Math.floor(diffDays / 7));
    setRemainDays(diffDays % 7);

    // Calculate Y, M, D
    let y = actual2.getUTCFullYear() - actual1.getUTCFullYear();
    let m = actual2.getUTCMonth() - actual1.getUTCMonth();
    let d = actual2.getUTCDate() - actual1.getUTCDate();

    if (d < 0) {
      m--;
      const prevMonth = new Date(Date.UTC(actual2.getUTCFullYear(), actual2.getUTCMonth(), 0));
      d += prevMonth.getUTCDate();
    }
    
    if (m < 0) {
      y--;
      m += 12;
    }

    setYears(y);
    setMonths(m);
    setDays(d);

    // Work days (Mon-Fri)
    let wDays = 0;
    let current = new Date(actual1.getTime());
    while (current < actual2) {
      const dayOfWeek = current.getUTCDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0=Sun, 6=Sat
        wDays++;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
    setWorkDays(wDays);
  };

  useEffect(() => {
    calculate();
  }, [start, end]);

  const copyResult = () => {
    if (totalDays === null) return;
    const text = `${totalDays} ${t("tools.date-difference.totalDays")}\n${years}Y ${months}M ${days}D\n${workDays} ${t("tools.date-difference.workDays")}`;
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {swappedWarning && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
          <Icon name="info" className="w-5 h-5 shrink-0" />
          {t("tools.date-difference.swapped")}
        </div>
      )}

      <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold">{t("tools.date-difference.startDate")}</label>
          <input 
            type="date" 
            value={start} 
            onChange={e => setStart(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <Icon name="arrow-right" className="w-6 h-6 text-muted-foreground hidden md:block mt-6" />
        
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold">{t("tools.date-difference.endDate")}</label>
          <input 
            type="date" 
            value={end} 
            onChange={e => setEnd(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {totalDays !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="md:col-span-3 bg-primary border border-primary text-primary-foreground rounded-3xl p-8 shadow-md flex justify-between items-center relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 scale-150 translate-x-1/4 -translate-y-1/4">
              <Icon name="calendar" className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 space-y-1">
              <p className="font-semibold opacity-90">{t("tools.date-difference.totalDays")}</p>
              <div className="text-6xl font-black">{totalDays}</div>
              <p className="text-sm font-medium opacity-80 pt-2">{weeks} Hafta, {remainDays} Gün</p>
            </div>
            
            <button 
              onClick={copyResult}
              className="relative z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              title={t("tools.date-difference.copy")}
            >
              {showCopied ? <Icon name="check" className="w-6 h-6" /> : <Icon name="copy" className="w-5 h-5" />}
            </button>
          </div>

          <div className="bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">{t("tools.date-difference.exactDiff")}</h3>
            <div className="text-2xl font-bold flex gap-2">
              <span>{years}<span className="text-sm font-normal text-muted-foreground ml-1">Y</span></span>
              <span className="text-muted-foreground/30">•</span>
              <span>{months}<span className="text-sm font-normal text-muted-foreground ml-1">A</span></span>
              <span className="text-muted-foreground/30">•</span>
              <span>{days}<span className="text-sm font-normal text-muted-foreground ml-1">G</span></span>
            </div>
          </div>

          <div className="bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">{t("tools.date-difference.workDays")}</h3>
            <div className="text-4xl font-bold text-foreground">{workDays}</div>
            <p className="text-xs font-medium text-muted-foreground">{t("tools.date-difference.workDaysSub")}</p>
          </div>

        </div>
      )}

    </div>
  );
}
