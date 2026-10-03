"use client";

import { Icon } from "@/components/icons/Icon";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTranslations } from "@/i18n/use-translations";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslations();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm"
        aria-label={t("nav.closeMenu")}
        onClick={onClose}
      />
      <div className="relative h-full w-[min(20rem,88vw)] border-r border-zinc-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-600"
          aria-label={t("nav.closeMenu")}
        >
          <Icon name="close" />
        </button>
        <Sidebar collapsed={false} onNavigate={onClose} />
      </div>
    </div>
  );
}
