"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

type JsonError = {
  message: string;
  line: number | null;
  col: number | null;
  position: number | null;
};

export function JsonFormatterTool() {
  const { t } = useTranslations();
  
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<JsonError | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [fileName, setFileName] = useState("auraconvert-formatted");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawOutputRef = useRef<string>("");

  // Extract line and column from a character position index
  const extractLineAndCol = (text: string, position: number) => {
    if (position < 0 || position > text.length) return { line: null, col: null };
    
    let line = 1;
    let col = 1;
    
    for (let i = 0; i < position; i++) {
      if (text[i] === '\n') {
        line++;
        col = 1;
      } else {
        col++;
      }
    }
    return { line, col };
  };

  // Tries to parse the browser's error message to find "position X"
  const parseJsonError = (rawInput: string, err: any): JsonError => {
    const msg = err instanceof Error ? err.message : String(err);
    let position: number | null = null;
    let line: number | null = null;
    let col: number | null = null;

    // Standard V8 error: "Unexpected token } in JSON at position 125"
    const posMatch = msg.match(/position (\d+)/i);
    if (posMatch && posMatch[1]) {
      position = parseInt(posMatch[1], 10);
    }
    
    // Firefox error: "JSON.parse: unexpected character at line 3 column 5 of the JSON data"
    const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
    if (lineColMatch && lineColMatch[1] && lineColMatch[2]) {
      line = parseInt(lineColMatch[1], 10);
      col = parseInt(lineColMatch[2], 10);
    }

    if (position !== null && (line === null || col === null)) {
      const lc = extractLineAndCol(rawInput, position);
      line = lc.line;
      col = lc.col;
    }

    return {
      message: msg,
      position,
      line,
      col
    };
  };

  const formatJson = (minify: boolean = false) => {
    if (!input.trim()) {
      setOutput("");
      rawOutputRef.current = "";
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = minify 
        ? JSON.stringify(parsed) 
        : JSON.stringify(parsed, null, 2);
        
      rawOutputRef.current = formatted;
      
      // Prevent UI freeze by truncating giant strings in textarea
      if (formatted.length > 200000) {
        setOutput(formatted.substring(0, 200000) + '\n\n... [İçerik çok büyük olduğu için kırpıldı. Dosyanın tamamını bilgisayarınıza indirebilirsiniz.]');
      } else {
        setOutput(formatted);
      }
      
      setError(null);
    } catch (err) {
      setOutput("");
      rawOutputRef.current = "";
      setError(parseJsonError(input, err));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use filename for the download later
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    if (nameWithoutExt) setFileName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setInput(result);
        // Automatically try to format when loaded
        try {
          const parsed = JSON.parse(result);
          const formatted = JSON.stringify(parsed, null, 2);
          rawOutputRef.current = formatted;
          if (formatted.length > 200000) {
            setOutput(formatted.substring(0, 200000) + '\n\n... [İçerik çok büyük olduğu için kırpıldı. Dosyanın tamamını bilgisayarınıza indirebilirsiniz.]');
          } else {
            setOutput(formatted);
          }
          setError(null);
        } catch (err) {
          setOutput("");
          rawOutputRef.current = "";
          setError(parseJsonError(result, err));
        }
      }
    };
    reader.onerror = () => {
      alert("Dosya okunurken bir hata oluştu.");
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async () => {
    if (!rawOutputRef.current) return;
    try {
      await navigator.clipboard.writeText(rawOutputRef.current);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Panoya kopyalanamadı:", err);
      alert("Panoya kopyalanamadı. Lütfen manuel seçip kopyalayın.");
    }
  };

  const downloadJson = () => {
    if (!rawOutputRef.current) return;
    const blob = new Blob([rawOutputRef.current], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auraconvert-${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("tools.json-formatter.name")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {t("tools.json-formatter.description")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Input Section */}
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Giriş (Input)</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setInput("")}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
                disabled={!input}
              >
                Temizle
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-md transition-colors border"
              >
                <Icon name="files" className="w-3.5 h-3.5" />
                Dosya Yükle (.json)
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".json,application/json" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="JSON verinizi buraya yapıştırın..."
            className="w-full h-80 lg:h-[500px] p-4 bg-card border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm leading-relaxed"
            spellCheck={false}
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => formatJson(true)}
              disabled={!input}
              className="px-4 py-2 border bg-background hover:bg-secondary text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
            >
              Küçült (Minify)
            </button>
            <button
              onClick={() => formatJson(false)}
              disabled={!input}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
            >
              Formatla (Pretty)
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Çıktı (Output)</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-md disabled:opacity-50 transition-colors border"
              >
                <Icon name={isCopied ? "check" : "files"} className="w-3.5 h-3.5" />
                {isCopied ? "Kopyalandı" : "Kopyala"}
              </button>
              <button
                onClick={downloadJson}
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-md disabled:opacity-50 transition-colors"
              >
                <Icon name="download" className="w-3.5 h-3.5" />
                İndir
              </button>
            </div>
          </div>

          <div className="relative w-full h-80 lg:h-[500px] border rounded-lg overflow-hidden bg-card">
            {error ? (
              <div className="absolute inset-0 p-6 bg-destructive/10 overflow-auto flex flex-col gap-2 border-2 border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Geçersiz JSON
                </div>
                <p className="text-sm font-mono text-destructive/90 break-words">
                  {error.message}
                </p>
                {(error.line !== null && error.col !== null) && (
                  <div className="mt-2 text-xs font-medium bg-destructive/20 text-destructive-foreground px-3 py-1.5 rounded-md inline-block w-max border border-destructive/20">
                    Satır: {error.line}, Kolon: {error.col}
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={output}
                readOnly
                placeholder="Formatlanmış JSON burada görünecek..."
                className="w-full h-full p-4 bg-transparent border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
            <span>{output ? "Geçerli JSON" : error ? "Doğrulama Hatası" : "Bekleniyor"}</span>
            {output && <span>{formatBytes(new Blob([rawOutputRef.current]).size)}</span>}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>
          JSON biçimlendirme işlemi sadece tarayıcınızda (yerel olarak) gerçekleştirilir. Verileriniz hiçbir sunucuya yüklenmez veya kaydedilmez.
        </p>
      </div>
    </div>
  );
}
