"use client";

import React, { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { Dropzone } from "@/components/ui/Dropzone";

type PdfFile = {
  id: string;
  file: File;
};

export function PdfMergerTool() {
  const { t, locale } = useTranslations();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateMagicBytes = async (file: File): Promise<boolean> => {
    try {
      const buffer = await file.slice(0, 4).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
    } catch {
      return false;
    }
  };

  const handleFilesSelect = async (selectedFiles: File[]) => {
    setError(null);
    const validFiles: PdfFile[] = [];
    let hasInvalid = false;

    for (const file of selectedFiles) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        hasInvalid = true;
        continue;
      }
      const isValidMagic = await validateMagicBytes(file);
      if (isValidMagic) {
        validFiles.push({ id: crypto.randomUUID(), file });
      } else {
        hasInvalid = true;
      }
    }

    if (hasInvalid) {
      setError(t("tools.pdf-merger.errorInvalidFile"));
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setError(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError(t("tools.pdf-merger.errorMinFiles"));
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "auraconvert-merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(locale === "tr" ? "Birleştirme sırasında beklenmeyen bir hata oluştu." : "An unexpected error occurred during merge.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-xl text-sm font-medium flex items-center gap-3">
          <Icon name="info" className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <Dropzone
          onFilesSelect={handleFilesSelect}
          multiple={true}
          accept=".pdf,application/pdf"
          label={t("tools.pdf-merger.uploadOrDrag")}
          description={t("tools.pdf-merger.uploadDescription")}
          iconName="files"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">
              {t("tools.pdf-merger.selectedFiles")} ({files.length})
            </h3>
            <div className="flex gap-2">
              <Dropzone
                onFilesSelect={handleFilesSelect}
                multiple={true}
                accept=".pdf,application/pdf"
                label="+"
                description=""
              />
              <button
                onClick={() => setFiles([])}
                className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors border border-destructive/20 bg-destructive/5"
              >
                {t("tools.pdf-merger.clearAll")}
              </button>
            </div>
          </div>

          {/* Add more files small dropzone */}
          <div className="hidden">
             {/* Note: I integrated the plus dropzone visually better below */}
          </div>

          <div className="space-y-3">
            {files.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                className="flex items-center gap-3 bg-secondary/30 border border-border p-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-primary-600 disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <Icon name="arrow-up" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="p-1 text-muted-foreground hover:text-primary-600 disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <Icon name="arrow-down" className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon name="files" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground" title={pdfFile.file.name}>
                      {pdfFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(pdfFile.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                >
                  <Icon name="trash" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Mini dropzone to add more */}
          <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary-400 transition-all text-muted-foreground hover:text-primary-600">
            <input
              type="file"
              className="sr-only"
              accept=".pdf,application/pdf"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesSelect(Array.from(e.target.files));
                }
                e.target.value = "";
              }}
            />
            <span className="flex items-center gap-2 text-sm font-medium">
              <Icon name="files" className="w-5 h-5" />
              + {t("tools.pdf-merger.addMore")}
            </span>
          </label>

          <button
            onClick={handleMerge}
            disabled={isProcessing || files.length < 2}
            className="w-full relative flex items-center justify-center py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm overflow-hidden"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t("tools.pdf-merger.processing")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon name="files" className="w-5 h-5" />
                {t("tools.pdf-merger.mergePdfs")}
              </span>
            )}
          </button>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <Icon name="info" className="w-5 h-5 shrink-0" />
        <p>{t("tools.pdf-merger.securityWarning")}</p>
      </div>
    </div>
  );
}
