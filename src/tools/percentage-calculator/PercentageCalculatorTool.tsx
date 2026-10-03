"use client";

import React, { useState } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function PercentageCalculatorTool() {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState(1);

  // Form states
  const [f1p, setF1p] = useState("");
  const [f1n, setF1n] = useState("");

  const [f2n1, setF2n1] = useState("");
  const [f2n2, setF2n2] = useState("");

  const [f3n1, setF3n1] = useState("");
  const [f3n2, setF3n2] = useState("");

  const [f4p, setF4p] = useState("");
  const [f4v, setF4v] = useState("");

  const [f5p, setF5p] = useState("");
  const [f5d, setF5d] = useState("");

  const formatNumber = (num: number) => {
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(4)).toString();
  };

  const parseNum = (str: string) => {
    const val = parseFloat(str.replace(/,/g, "."));
    return isNaN(val) ? null : val;
  };

  const renderResult = (title: string, value: string | React.ReactNode, sub?: string) => (
    <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl mt-4 animate-in fade-in slide-in-from-bottom-2">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <p className="text-sm font-medium text-muted-foreground mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <button onClick={() => setActiveTab(1)} className={cn("text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all", activeTab === 1 ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 hover:bg-secondary text-secondary-foreground")}>
          {t("tools.percentage-calculator.calc1")}
        </button>
        <button onClick={() => setActiveTab(2)} className={cn("text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all", activeTab === 2 ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 hover:bg-secondary text-secondary-foreground")}>
          {t("tools.percentage-calculator.calc2")}
        </button>
        <button onClick={() => setActiveTab(3)} className={cn("text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all", activeTab === 3 ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 hover:bg-secondary text-secondary-foreground")}>
          {t("tools.percentage-calculator.calc3")}
        </button>
        <button onClick={() => setActiveTab(4)} className={cn("text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all", activeTab === 4 ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 hover:bg-secondary text-secondary-foreground")}>
          {t("tools.percentage-calculator.calc4")}
        </button>
        <button onClick={() => setActiveTab(5)} className={cn("text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all", activeTab === 5 ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 hover:bg-secondary text-secondary-foreground")}>
          {t("tools.percentage-calculator.calc5")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background border border-border rounded-3xl p-6 shadow-sm min-h-[400px]">
        
        {/* Tab 1: Percentage of a number */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("tools.percentage-calculator.calc1")}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <input type="number" value={f1n} onChange={(e) => setF1n(e.target.value)} placeholder={t("tools.percentage-calculator.numberPlaceholder")} className="w-full pl-4 pr-10 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <span className="font-medium text-muted-foreground hidden sm:block">sayısının</span>
              <div className="flex-1 w-full relative">
                <input type="number" value={f1p} onChange={(e) => setF1p(e.target.value)} placeholder={t("tools.percentage-calculator.percentPlaceholder")} className="w-full pl-4 pr-10 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
            {parseNum(f1n) !== null && parseNum(f1p) !== null && (
              renderResult(t("tools.percentage-calculator.result"), formatNumber((parseNum(f1n)! * parseNum(f1p)!) / 100))
            )}
          </div>
        )}

        {/* Tab 2: What % is X of Y */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("tools.percentage-calculator.calc2")}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <input type="number" value={f2n1} onChange={(e) => setF2n1(e.target.value)} placeholder={t("tools.percentage-calculator.numberPlaceholder")} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <span className="font-medium text-muted-foreground">,</span>
              <div className="flex-1 w-full relative">
                <input type="number" value={f2n2} onChange={(e) => setF2n2(e.target.value)} placeholder={t("tools.percentage-calculator.numberPlaceholder")} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <span className="font-medium text-muted-foreground hidden sm:block">sayısının yüzde kaçıdır?</span>
            </div>
            {parseNum(f2n1) !== null && parseNum(f2n2) !== null && parseNum(f2n2) !== 0 && (
              renderResult(t("tools.percentage-calculator.result"), `% ${formatNumber((parseNum(f2n1)! / parseNum(f2n2)!) * 100)}`)
            )}
            {parseNum(f2n2) === 0 && <p className="text-sm text-destructive mt-4">{t("tools.percentage-calculator.invalidInput")}</p>}
          </div>
        )}

        {/* Tab 3: Percentage Change */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("tools.percentage-calculator.calc3")}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <label className="text-xs text-muted-foreground mb-1 block">Eski Değer</label>
                <input type="number" value={f3n1} onChange={(e) => setF3n1(e.target.value)} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <Icon name="arrow-right" className="w-5 h-5 text-muted-foreground hidden sm:block mt-5" />
              <div className="flex-1 w-full relative">
                <label className="text-xs text-muted-foreground mb-1 block">Yeni Değer</label>
                <input type="number" value={f3n2} onChange={(e) => setF3n2(e.target.value)} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            {parseNum(f3n1) !== null && parseNum(f3n2) !== null && parseNum(f3n1) !== 0 && (() => {
              const oldV = parseNum(f3n1)!;
              const newV = parseNum(f3n2)!;
              const diff = newV - oldV;
              const perc = (diff / Math.abs(oldV)) * 100;
              const isInc = perc > 0;
              const isDec = perc < 0;
              return renderResult(
                t("tools.percentage-calculator.result"), 
                <span className={cn(isInc ? "text-green-500" : isDec ? "text-destructive" : "")}>
                  {isInc ? "▲" : isDec ? "▼" : ""} % {formatNumber(Math.abs(perc))}
                </span>,
                isInc ? t("tools.percentage-calculator.increase").replace("{result}", "") : isDec ? t("tools.percentage-calculator.decrease").replace("{result}", "") : ""
              );
            })()}
          </div>
        )}

        {/* Tab 4: Add/Subtract VAT */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("tools.percentage-calculator.calc4")}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 w-full">
                <label className="text-xs text-muted-foreground mb-1 block">{t("tools.percentage-calculator.price")}</label>
                <input type="number" value={f4p} onChange={(e) => setF4p(e.target.value)} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs text-muted-foreground mb-1 block">{t("tools.percentage-calculator.vatRate")}</label>
                <div className="relative">
                  <input type="number" value={f4v} onChange={(e) => setF4v(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            {parseNum(f4p) !== null && parseNum(f4v) !== null && (() => {
              const price = parseNum(f4p)!;
              const vat = parseNum(f4v)!;
              const vatAmount = price * (vat / 100);
              const included = price + vatAmount;
              const excluded = price / (1 + (vat / 100));
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {renderResult(t("tools.percentage-calculator.vatAdd") + " (KDV Eklendiğinde)", formatNumber(included), `KDV Tutarı: ${formatNumber(vatAmount)}`)}
                  {renderResult(t("tools.percentage-calculator.vatSub") + " (KDV İçindeyse)", formatNumber(excluded), `KDV Tutarı: ${formatNumber(price - excluded)}`)}
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab 5: Discount Calculator */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("tools.percentage-calculator.calc5")}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 w-full">
                <label className="text-xs text-muted-foreground mb-1 block">{t("tools.percentage-calculator.price")}</label>
                <input type="number" value={f5p} onChange={(e) => setF5p(e.target.value)} className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs text-muted-foreground mb-1 block">{t("tools.percentage-calculator.discountRate")}</label>
                <div className="relative">
                  <input type="number" value={f5d} onChange={(e) => setF5d(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-secondary/30 border border-border rounded-xl text-lg font-medium outline-none focus:border-primary transition-colors" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            {parseNum(f5p) !== null && parseNum(f5d) !== null && (() => {
              const price = parseNum(f5p)!;
              const discount = parseNum(f5d)!;
              const save = price * (discount / 100);
              const final = price - save;
              return renderResult(
                t("tools.percentage-calculator.discountedPrice"), 
                formatNumber(final),
                `${t("tools.percentage-calculator.savings")}: ${formatNumber(save)}`
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
