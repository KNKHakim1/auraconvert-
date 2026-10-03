"use client";

import { useState, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { Navbar } from "@/components/layout/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary-200 selection:text-primary-900">
      {/* Modern Grid Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-50" />
      
      {/* Floating Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 flex justify-center overflow-hidden">
        <div className="absolute -top-[20%] w-[120%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-500),0.15),transparent_70%)] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-12 animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
      
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
