"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "time";

interface Unit {
  id: string;
  nameKey: string;
  factor?: number; // Multiply by this to get base unit (except temp)
}

const unitData: Record<Category, Unit[]> = {
  length: [
    { id: "m", nameKey: "m", factor: 1 },
    { id: "mm", nameKey: "mm", factor: 0.001 },
    { id: "cm", nameKey: "cm", factor: 0.01 },
    { id: "km", nameKey: "km", factor: 1000 },
    { id: "inch", nameKey: "inch", factor: 0.0254 },
    { id: "feet", nameKey: "feet", factor: 0.3048 },
    { id: "yard", nameKey: "yard", factor: 0.9144 },
    { id: "mile", nameKey: "mile", factor: 1609.344 },
  ],
  weight: [
    { id: "kg", nameKey: "kg", factor: 1 },
    { id: "mg", nameKey: "mg", factor: 0.000001 },
    { id: "g", nameKey: "g", factor: 0.001 },
    { id: "ton", nameKey: "ton", factor: 1000 },
    { id: "oz", nameKey: "oz", factor: 0.02834952 },
    { id: "lb", nameKey: "lb", factor: 0.45359237 },
  ],
  temperature: [
    { id: "celsius", nameKey: "celsius" },
    { id: "fahrenheit", nameKey: "fahrenheit" },
    { id: "kelvin", nameKey: "kelvin" },
  ],
  area: [
    { id: "m2", nameKey: "m2", factor: 1 },
    { id: "km2", nameKey: "km2", factor: 1000000 },
    { id: "hectare", nameKey: "hectare", factor: 10000 },
    { id: "acre", nameKey: "acre", factor: 4046.85642 },
  ],
  volume: [
    { id: "l", nameKey: "l", factor: 1 },
    { id: "ml", nameKey: "ml", factor: 0.001 },
    { id: "m3", nameKey: "m3", factor: 1000 },
    { id: "gallon", nameKey: "gallon", factor: 3.78541178 },
  ],
  time: [
    { id: "sec", nameKey: "sec", factor: 1 },
    { id: "min", nameKey: "min", factor: 60 },
    { id: "hr", nameKey: "hr", factor: 3600 },
    { id: "day", nameKey: "day", factor: 86400 },
  ],
};

export function UnitConverterTool() {
  const { t } = useTranslations();
  
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState<string>("km");
  const [toUnit, setToUnit] = useState<string>("m");
  const [inputValue, setInputValue] = useState<string>("1");
  const [result, setResult] = useState<string>("");
  const [showCopied, setShowCopied] = useState(false);

  // When category changes, reset units
  useEffect(() => {
    const units = unitData[category];
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  }, [category]);

  const convertTemperature = (val: number, from: string, to: string) => {
    if (from === to) return val;
    let celsius = val;
    // Convert to Celsius first
    if (from === "fahrenheit") celsius = (val - 32) * 5/9;
    if (from === "kelvin") celsius = val - 273.15;

    // Convert from Celsius to Target
    if (to === "celsius") return celsius;
    if (to === "fahrenheit") return (celsius * 9/5) + 32;
    if (to === "kelvin") return celsius + 273.15;
    return val;
  };

  useEffect(() => {
    const val = parseFloat(inputValue.replace(/,/g, "."));
    if (isNaN(val)) {
      setResult("");
      return;
    }

    if (category === "temperature") {
      const res = convertTemperature(val, fromUnit, toUnit);
      setResult(parseFloat(res.toFixed(6)).toString());
    } else {
      const fromFactor = unitData[category].find(u => u.id === fromUnit)?.factor || 1;
      const toFactor = unitData[category].find(u => u.id === toUnit)?.factor || 1;
      
      const baseValue = val * fromFactor;
      const finalValue = baseValue / toFactor;
      
      setResult(parseFloat(finalValue.toFixed(8)).toString());
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Category Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">{t("tools.unit-converter.category")}</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(unitData) as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  category === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {t(`tools.unit-converter.categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Converter Area */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold">{t("tools.unit-converter.from")}</label>
            <select 
              value={fromUnit} 
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl font-medium outline-none focus:border-primary"
            >
              {unitData[category].map(u => (
                <option key={u.id} value={u.id}>{t(`tools.unit-converter.units.${u.nameKey}`)}</option>
              ))}
            </select>
            <input 
              type="number" 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-4 py-3 mt-2 bg-background border border-border rounded-xl text-xl font-bold outline-none focus:border-primary"
            />
          </div>

          <button 
            onClick={swapUnits}
            className="md:mt-6 w-12 h-12 shrink-0 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
            title="Swap"
          >
            <Icon name="arrow-right-left" className="w-5 h-5 rotate-90 md:rotate-0" />
          </button>

          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold">{t("tools.unit-converter.to")}</label>
            <select 
              value={toUnit} 
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl font-medium outline-none focus:border-primary"
            >
              {unitData[category].map(u => (
                <option key={u.id} value={u.id}>{t(`tools.unit-converter.units.${u.nameKey}`)}</option>
              ))}
            </select>
            <div className="relative mt-2">
              <input 
                type="text" 
                readOnly 
                value={result} 
                className="w-full pl-4 pr-12 py-3 bg-primary/5 border border-primary/20 rounded-xl text-xl font-bold text-primary outline-none"
              />
              <button 
                onClick={copyResult}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                title={t("tools.unit-converter.copy")}
              >
                {showCopied ? <Icon name="check" className="w-5 h-5 text-green-500" /> : <Icon name="copy" className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
