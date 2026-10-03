import { useCallback, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export function Dropzone({
  onFileSelect,
  onFilesSelect,
  multiple = false,
  accept,
  label = "Görsel yükle veya sürükle",
  description = "PNG, JPG veya WebP (Maksimum 10MB)",
  iconName = "image",
}: {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  description?: string;
  iconName?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (multiple && onFilesSelect) {
          onFilesSelect(Array.from(e.dataTransfer.files));
        } else if (onFileSelect) {
          onFileSelect(e.dataTransfer.files[0]);
        }
      }
    },
    [onFileSelect, onFilesSelect, multiple]
  );

  return (
    <label
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all",
        isDragging
          ? "border-primary-500 bg-primary-500/10 scale-[1.02]"
          : "border-border bg-secondary/30 hover:border-primary-400 hover:bg-secondary/50"
      )}
    >
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            if (multiple && onFilesSelect) {
              onFilesSelect(Array.from(e.target.files));
            } else if (onFileSelect) {
              onFileSelect(e.target.files[0]);
            }
          }
        }}
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border shadow-sm mb-4 text-primary-500">
        <Icon name={iconName} className="h-8 w-8" />
      </div>
      <p className="text-lg font-medium text-foreground">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </label>
  );
}
