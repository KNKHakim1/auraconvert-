"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "@/i18n/use-translations";

function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function countLines(value: string): number {
  if (!value) {
    return 0;
  }
  return value.split(/\n/).length;
}

export default function CharacterCounterTool() {
  const { t } = useTranslations();
  const [text, setText] = useState("");

  const stats = useMemo(
    () => ({
      characters: text.length,
      words: countWords(text),
      lines: countLines(text),
    }),
    [text],
  );

  return (
    <div className="space-y-6">
      <label className="block space-y-3">
        <span className="text-sm font-medium text-zinc-700">
          {t("characterCounter.inputLabel")}
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={12}
          spellCheck
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base leading-relaxed text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
          placeholder={t("characterCounter.placeholder")}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t("characterCounter.characters")} value={stats.characters} />
        <StatCard label={t("characterCounter.words")} value={stats.words} />
        <StatCard label={t("characterCounter.lines")} value={stats.lines} />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setText("")}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-primary-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {t("characterCounter.reset")}
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
      <p className="text-sm text-zinc-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
    </div>
  );
}
