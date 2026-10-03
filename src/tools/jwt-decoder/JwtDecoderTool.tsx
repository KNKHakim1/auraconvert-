"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

interface DecodedJWT {
  header: object;
  payload: object;
  signatureBase64Url: string;
  signatureHex: string;
}

// Safely decodes Base64URL to a string
const decodeBase64Url = (base64url: string): string => {
  try {
    let str = base64url.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4 !== 0) {
      str += "=";
    }
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (err) {
    throw new Error("Invalid Base64URL");
  }
};

const base64UrlToHex = (base64url: string): string => {
  try {
    let str = base64url.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4 !== 0) {
      str += "=";
    }
    const binary = atob(str);
    const hexArr = [];
    for (let i = 0; i < binary.length; i++) {
      hexArr.push(binary.charCodeAt(i).toString(16).padStart(2, "0"));
    }
    return hexArr.join(" ");
  } catch (err) {
    return "";
  }
};

export function JwtDecoderTool() {
  const { t } = useTranslations();
  
  const [input, setInput] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const decodedResult = useMemo(() => {
    if (!input.trim()) return null;
    
    const parts = input.trim().split(".");
    if (parts.length !== 3) {
      return { error: t("tools.jwt-decoder.errorFormat") };
    }

    try {
      const headerStr = decodeBase64Url(parts[0]);
      const payloadStr = decodeBase64Url(parts[1]);
      
      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      return {
        data: {
          header: headerObj,
          payload: payloadObj,
          signatureBase64Url: parts[2],
          signatureHex: base64UrlToHex(parts[2])
        } as DecodedJWT
      };
    } catch (err) {
      return { error: t("tools.jwt-decoder.errorParse") };
    }
  }, [input, t]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadJson = (obj: object, filename: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auraconvert-${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderClaimDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString();
  };

  return (
    <div className="space-y-8">
      
      {/* Security Warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg text-sm flex gap-3 border border-amber-200 dark:border-amber-800/50">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.jwt-decoder.securityWarning")}</p>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {t("tools.jwt-decoder.inputLabel")}
          </label>
          {input && (
            <button
              onClick={() => setInput("")}
              className="text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
            >
              {t("tools.jwt-decoder.clear")}
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("tools.jwt-decoder.inputPlaceholder")}
          className={cn(
            "w-full h-32 p-4 bg-background border rounded-xl resize-none outline-none font-mono text-sm transition-all shadow-sm focus:ring-2",
            decodedResult?.error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border focus:border-primary-500 focus:ring-primary-500"
          )}
        />
        {decodedResult?.error && (
          <p className="text-sm text-destructive font-semibold flex items-center gap-2">
            <Icon name="info" className="w-4 h-4" />
            {decodedResult.error}
          </p>
        )}
      </div>

      {/* Decoded Results */}
      {decodedResult?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Header & Signature Column */}
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  {t("tools.jwt-decoder.headerLabel")}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(decodedResult.data?.header, null, 2), "header")}
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name={copiedField === "header" ? "check" : "copy"} className={cn("w-3.5 h-3.5", copiedField === "header" && "text-green-500")} />
                    {copiedField === "header" ? t("tools.jwt-decoder.copied") : t("tools.jwt-decoder.copy")}
                  </button>
                  <button 
                    onClick={() => downloadJson(decodedResult.data?.header || {}, "jwt-header")}
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name="download" className="w-3.5 h-3.5" />
                    {t("tools.jwt-decoder.downloadJson")}
                  </button>
                </div>
              </div>
              <pre className="p-4 text-sm font-mono overflow-x-auto text-foreground">
                {JSON.stringify(decodedResult.data.header, null, 2)}
              </pre>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                  {t("tools.jwt-decoder.signatureLabel")}
                </h3>
                <button 
                  onClick={() => copyToClipboard(decodedResult.data?.signatureHex || "", "signature")}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon name={copiedField === "signature" ? "check" : "copy"} className={cn("w-3.5 h-3.5", copiedField === "signature" && "text-green-500")} />
                  {copiedField === "signature" ? t("tools.jwt-decoder.copied") : t("tools.jwt-decoder.copy")}
                </button>
              </div>
              <div className="p-4 text-sm font-mono overflow-x-auto break-all text-muted-foreground">
                {decodedResult.data.signatureHex}
              </div>
            </div>
          </div>

          {/* Payload Column */}
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                  {t("tools.jwt-decoder.payloadLabel")}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(decodedResult.data?.payload, null, 2), "payload")}
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name={copiedField === "payload" ? "check" : "copy"} className={cn("w-3.5 h-3.5", copiedField === "payload" && "text-green-500")} />
                    {copiedField === "payload" ? t("tools.jwt-decoder.copied") : t("tools.jwt-decoder.copy")}
                  </button>
                  <button 
                    onClick={() => downloadJson(decodedResult.data?.payload || {}, "jwt-payload")}
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name="download" className="w-3.5 h-3.5" />
                    {t("tools.jwt-decoder.downloadJson")}
                  </button>
                </div>
              </div>
              <pre className="p-4 text-sm font-mono overflow-x-auto text-foreground">
                {JSON.stringify(decodedResult.data.payload, null, 2)}
              </pre>
            </div>

            {/* Claims Analysis */}
            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("tools.jwt-decoder.claimsTitle")}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(decodedResult.data.payload).filter(([k]) => ['iss','sub','aud','exp','nbf','iat','jti'].includes(k)).map(([key, val]) => {
                  let label = key;
                  let displayVal = String(val);
                  let isExpired = false;

                  if (key === 'iss') label = t("tools.jwt-decoder.claim_iss");
                  if (key === 'sub') label = t("tools.jwt-decoder.claim_sub");
                  if (key === 'aud') label = t("tools.jwt-decoder.claim_aud");
                  if (key === 'jti') label = t("tools.jwt-decoder.claim_jti");
                  
                  if (['exp', 'nbf', 'iat'].includes(key) && typeof val === 'number') {
                    if (key === 'exp') {
                      label = t("tools.jwt-decoder.claim_exp");
                      if (val * 1000 < Date.now()) isExpired = true;
                    }
                    if (key === 'nbf') label = t("tools.jwt-decoder.claim_nbf");
                    if (key === 'iat') label = t("tools.jwt-decoder.claim_iat");
                    
                    const dt = renderClaimDate(val);
                    if (dt) displayVal = dt;
                  }

                  return (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50 last:border-0 gap-1">
                      <span className="text-sm font-medium text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground break-all">{displayVal}</span>
                        {isExpired && (
                          <span className="text-xs font-semibold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                            {t("tools.jwt-decoder.expired")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {Object.keys(decodedResult.data.payload).filter((k) => ['iss','sub','aud','exp','nbf','iat','jti'].includes(k)).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No standard claims found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
