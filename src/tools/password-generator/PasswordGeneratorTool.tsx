"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

export function PasswordGeneratorTool() {
  const { t } = useTranslations();
  
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePassword = useCallback(() => {
    setError(null);
    setCopied(false);

    let charset = "";
    if (options.uppercase) charset += CHARSETS.uppercase;
    if (options.lowercase) charset += CHARSETS.lowercase;
    if (options.numbers) charset += CHARSETS.numbers;
    if (options.symbols) charset += CHARSETS.symbols;

    if (charset.length === 0) {
      setError(t("tools.password-generator.errorNoOption"));
      setPassword("");
      return;
    }

    // Web Crypto API for secure random generation
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }
    
    setPassword(generated);
  }, [length, options, t]);

  // Initial generation
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("tools.password-generator.name")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {t("tools.password-generator.description")}
        </p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden glass shadow-sm">
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Password Display */}
          <div className="relative group">
            <div className="flex items-center justify-between p-4 sm:p-6 bg-secondary/30 rounded-xl border border-border/50 break-all min-h-[80px]">
              {error ? (
                <span className="text-destructive font-medium">{error}</span>
              ) : (
                <span className="text-xl sm:text-2xl font-mono font-medium tracking-wider text-foreground">
                  {password}
                </span>
              )}
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={generatePassword}
                className="p-2 bg-background border border-border text-muted-foreground hover:text-primary-600 rounded-lg shadow-sm transition-colors"
                title={t("tools.password-generator.generate")}
              >
                <Icon name="refresh" className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!password || !!error}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm transition-all",
                  copied 
                    ? "bg-green-500/10 border-green-500/30 text-green-600" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent disabled:opacity-50"
                )}
              >
                <Icon name={copied ? "check" : "copy"} className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline-block">
                  {copied ? t("tools.password-generator.copied") : t("tools.password-generator.copy")}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  {t("tools.password-generator.length")}: <span className="text-primary-600 font-bold ml-1">{length}</span>
                </label>
              </div>
              <input
                type="range"
                min="8"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8</span>
                <span>128</span>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-secondary/20 transition-colors">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">{t("tools.password-generator.uppercase")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-secondary/20 transition-colors">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">{t("tools.password-generator.lowercase")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-secondary/20 transition-colors">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">{t("tools.password-generator.numbers")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-secondary/20 transition-colors">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">{t("tools.password-generator.symbols")}</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>
          {t("tools.password-generator.securityWarning")}
        </p>
      </div>
    </div>
  );
}
