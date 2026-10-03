"use client";

import Link from "next/link";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Icon } from "@/components/icons/Icon";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CategorySection } from "@/components/tools/CategorySection";
import { ToolCard } from "@/components/tools/ToolCard";
import { useTranslations } from "@/i18n/use-translations";
import { toolCategories } from "@/tools/categories";
import {
  getFeaturedTools,
  getPopularTools,
  getRecentTools,
  getToolsByCategory,
} from "@/tools/registry";

export function HomePage() {
  const { t } = useTranslations();
  const popular = getPopularTools();
  const featured = getFeaturedTools();
  const recent = getRecentTools();

  return (
    <div className="mx-auto w-full space-y-20 pb-20">
      
      {/* Massive Modern Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-20 sm:pt-32 sm:pb-28 text-center animate-fade-in">
        
        {/* Animated Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none animate-float" />
        
        <div className="relative z-10 max-w-4xl px-4 space-y-8 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wide backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            {t("home.eyebrow")}
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-[5rem] leading-[1.1]">
            {t("home.heroTitle").split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient bg-clip-text text-transparent">
              {t("home.heroTitle").split(' ').slice(-1)}
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          
          <div className="w-full max-w-2xl mt-8">
            <GlobalSearch variant="hero" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-green-500" />
              <span>%100 Ücretsiz</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-green-500" />
              <span>Kayıt Yok</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-green-500" />
              <span>Sınırsız Kullanım</span>
            </div>
          </div>

        </div>
      </section>

      {/* Stats / Trust Badges */}
      <section className="border-y border-border/50 bg-card/30 glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-wrap justify-center gap-8 sm:gap-16">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-foreground">100+</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{t("home.toolsCount").split(' ')[0] || "ARAÇ"}</span>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-foreground">%100</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">GİZLİLİK (LOKAL)</span>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-foreground">0</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">KAYIT & ÜCRET</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 w-full space-y-24 pt-12">
        {/* Popular Tools - Modern Carousel/Grid Layout */}
        <section className="space-y-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                <Icon name="trending-up" className="w-8 h-8 text-primary-500" />
                {t("home.popular")}
              </h2>
              <p className="text-muted-foreground">Kullanıcıların en çok tercih ettiği ücretsiz araçlar.</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors bg-primary-500/10 px-4 py-2 rounded-full">
              Tümünü Gör
              <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.slice(0, 4).map((tool, idx) => (
              <div key={tool.id} className="relative group">
                {idx === 0 && <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-500" />}
                <ToolCard tool={tool} className={`relative h-full ${idx === 0 ? "border-primary-500/50 bg-card/60" : ""}`} />
                {idx === 0 && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/30 rotate-12">
                    #1 POPÜLER
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="w-full">
          <AdPlaceholder slot="homepage" className="py-8 rounded-3xl overflow-hidden glass border-border/50 bg-background/50" />
        </div>

        {/* Bento Box Layout for Categories & Recent Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Categories (Left side, takes 4 columns) */}
          <section className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 mb-6">
              <Icon name="folder" className="w-6 h-6 text-primary-500" />
              {t("home.categories")}
            </h2>
            <div className="flex flex-col gap-3">
              {toolCategories.map((category) => {
                const count = getToolsByCategory(category.id).length;
                return (
                  <Link
                    key={category.id}
                    href={`/tools?category=${category.id}`}
                    className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/80 transition-all hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all">
                        <Icon name={category.icon} className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-foreground">{t(`categories.${category.id}.name`)}</span>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Featured/Recent Tools (Right side, takes 8 columns) */}
          <section className="lg:col-span-8 space-y-8">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-card/80 to-background border border-border p-8 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <Icon name="star" className="w-7 h-7 text-yellow-500" />
                  Öne Çıkanlar & Yeniler
                </h2>
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2">
                {featured.slice(0, 2).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} className="bg-background/80" />
                ))}
                {recent.slice(0, 2).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} className="bg-background/80" />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* All Categories Sections */}
        <div className="space-y-16 pt-10 border-t border-border/50">
          {toolCategories
            .filter((category) => getToolsByCategory(category.id).length > 0)
            .map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                tools={getToolsByCategory(category.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
