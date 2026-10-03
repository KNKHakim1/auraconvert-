"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function AgeCalculatorTool() {
  const { t } = useTranslations();
  
  // Using strings (YYYY-MM-DD) to avoid timezone shifts from standard input
  const [dob, setDob] = useState("");
  const [target, setTarget] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  
  // Results
  const [years, setYears] = useState<number | null>(null);
  const [months, setMonths] = useState<number | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [nextBdayDays, setNextBdayDays] = useState<number | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);

  // Initialize target date to today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setTarget(`${yyyy}-${mm}-${dd}`);
  }, []);

  const calculateAge = () => {
    setError(null);
    if (!dob || !target) return;

    // Parse explicitly as local dates to avoid UTC offset shifts
    const [bY, bM, bD] = dob.split("-").map(Number);
    const [tY, tM, tD] = target.split("-").map(Number);

    const bDate = new Date(bY, bM - 1, bD);
    const tDate = new Date(tY, tM - 1, tD);

    if (isNaN(bDate.getTime()) || isNaN(tDate.getTime())) {
      setError(t("tools.age-calculator.invalidDate"));
      return;
    }

    if (bDate > tDate) {
      setError(t("tools.age-calculator.futureError"));
      return;
    }

    // Calculate Y, M, D
    let y = tDate.getFullYear() - bDate.getFullYear();
    let m = tDate.getMonth() - bDate.getMonth();
    let d = tDate.getDate() - bDate.getDate();

    if (d < 0) {
      m--;
      // Days in previous month
      const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
      d += prevMonth.getDate();
    }
    
    if (m < 0) {
      y--;
      m += 12;
    }

    setYears(y);
    setMonths(m);
    setDays(d);

    // Total days
    const diffTime = Math.abs(tDate.getTime() - bDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setTotalDays(diffDays);

    // Next birthday
    let nextB = new Date(tDate.getFullYear(), bDate.getMonth(), bDate.getDate());
    if (tDate > nextB) {
      nextB = new Date(tDate.getFullYear() + 1, bDate.getMonth(), bDate.getDate());
    }
    const nbDiff = Math.ceil((nextB.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));
    setNextBdayDays(nbDiff);

    // Day of week
    const daysArr = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const daysArrEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Choose array based on locale if possible, fallback to checking some translation
    const isEn = t("tools.age-calculator.years") === "Years";
    setDayOfWeek(isEn ? daysArrEn[bDate.getDay()] : daysArr[bDate.getDay()]);
  };

  useEffect(() => {
    if (dob && target) {
      calculateAge();
    }
  }, [dob, target]);

  const reset = () => {
    setDob("");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setTarget(`${yyyy}-${mm}-${dd}`);
    setYears(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background border border-border rounded-3xl p-6 shadow-sm space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("tools.age-calculator.dobLabel")}</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("tools.age-calculator.targetDateLabel")}</label>
            <input 
              type="date" 
              value={target} 
              onChange={(e) => setTarget(e.target.value)} 
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <button 
            onClick={reset}
            className="w-full py-3 bg-secondary text-secondary-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all border border-border"
          >
            {t("tools.age-calculator.resetBtn")}
          </button>
        </div>

        {years !== null && !error && (
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="text-center space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("tools.age-calculator.ageExact")}</h3>
              <div className="flex justify-center items-end gap-3 text-primary">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold">{years}</span>
                  <span className="text-sm font-medium">{t("tools.age-calculator.years")}</span>
                </div>
                <span className="text-3xl font-light pb-5">-</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold">{months}</span>
                  <span className="text-sm font-medium">{t("tools.age-calculator.months")}</span>
                </div>
                <span className="text-3xl font-light pb-5">-</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold">{days}</span>
                  <span className="text-sm font-medium">{t("tools.age-calculator.days")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
              <div className="bg-background/50 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-bold text-foreground">{totalDays}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">{t("tools.age-calculator.totalDays")}</span>
              </div>
              
              <div className="bg-background/50 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-bold text-foreground">{nextBdayDays}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">{t("tools.age-calculator.nextBirthday")}</span>
              </div>

              <div className="col-span-2 bg-background/50 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <span className="text-xl font-bold text-foreground">{dayOfWeek}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">{t("tools.age-calculator.bornOn")}</span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
