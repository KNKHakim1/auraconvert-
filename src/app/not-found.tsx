"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/use-translations";

export default function NotFound() {
  const { t } = useTranslations();

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="text-3xl font-semibold text-white">{t("notFound.title")}</h1>
      <p className="mt-3 text-zinc-400">{t("notFound.body")}</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-primary-500/20 px-4 py-2 text-sm text-primary-100"
      >
        {t("notFound.home")}
      </Link>
    </div>
  );
}
