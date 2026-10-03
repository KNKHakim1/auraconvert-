"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

const BEEP_BASE64 = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // A simple beep would be long. I will just use an oscillator using Web Audio API instead of a file to save space and avoid dependencies.

function playBeep() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {
    console.warn("Audio not supported or blocked");
  }
}

function formatTimeMs(timeMs: number) {
  const ms = Math.floor(timeMs % 1000 / 10);
  const s = Math.floor((timeMs / 1000) % 60);
  const m = Math.floor((timeMs / (1000 * 60)) % 60);
  const h = Math.floor(timeMs / (1000 * 60 * 60));

  const msStr = ms.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');
  const mStr = m.toString().padStart(2, '0');
  const hStr = h > 0 ? h.toString().padStart(2, '0') + ":" : "";

  return `${hStr}${mStr}:${sStr}.${msStr}`;
}

export function StopwatchTool() {
  const { t } = useTranslations();
  
  const [tab, setTab] = useState<"stopwatch" | "timer">("stopwatch");

  // Stopwatch state
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [laps, setLaps] = useState<{lap: number, total: number, diff: number}[]>([]);
  const swRef = useRef<{ start: number, acc: number, raf: number | null }>({ start: 0, acc: 0, raf: null });

  // Timer state
  const [tmRunning, setTmRunning] = useState(false);
  const [tmInputs, setTmInputs] = useState({ h: "", m: "", s: "" });
  const [tmTime, setTmTime] = useState(0); // target duration in ms
  const [tmLeft, setTmLeft] = useState(0); // ms left
  const [tmAlarm, setTmAlarm] = useState(false);
  const tmRef = useRef<{ end: number, raf: number | null, pausedLeft: number }>({ end: 0, raf: null, pausedLeft: 0 });
  const alarmIntervalRef = useRef<any>(null);

  // --- STOPWATCH LOGIC ---
  const swUpdate = () => {
    if (!swRunning) return;
    const now = Date.now();
    setSwTime(swRef.current.acc + (now - swRef.current.start));
    swRef.current.raf = requestAnimationFrame(swUpdate);
  };

  useEffect(() => {
    if (swRunning) {
      swRef.current.start = Date.now();
      swRef.current.raf = requestAnimationFrame(swUpdate);
    } else {
      if (swRef.current.raf) cancelAnimationFrame(swRef.current.raf);
    }
    return () => { if (swRef.current.raf) cancelAnimationFrame(swRef.current.raf); };
  }, [swRunning]);

  const swStartPause = () => {
    if (swRunning) {
      swRef.current.acc += Date.now() - swRef.current.start;
      setSwRunning(false);
    } else {
      setSwRunning(true);
    }
  };

  const swReset = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
    swRef.current = { start: 0, acc: 0, raf: null };
  };

  const swLap = () => {
    if (!swRunning) return;
    const currentTotal = swRef.current.acc + (Date.now() - swRef.current.start);
    const lastTotal = laps.length > 0 ? laps[0].total : 0;
    const diff = currentTotal - lastTotal;
    setLaps(prev => [{ lap: prev.length + 1, total: currentTotal, diff }, ...prev]);
  };

  // --- TIMER LOGIC ---
  const tmUpdate = () => {
    if (!tmRunning) return;
    const now = Date.now();
    const left = tmRef.current.end - now;
    if (left <= 0) {
      setTmLeft(0);
      setTmRunning(false);
      setTmAlarm(true);
      playBeep();
      alarmIntervalRef.current = setInterval(playBeep, 1000);
      return;
    }
    setTmLeft(left);
    tmRef.current.raf = requestAnimationFrame(tmUpdate);
  };

  useEffect(() => {
    if (tmRunning) {
      tmRef.current.end = Date.now() + tmRef.current.pausedLeft;
      tmRef.current.raf = requestAnimationFrame(tmUpdate);
    } else {
      if (tmRef.current.raf) cancelAnimationFrame(tmRef.current.raf);
    }
    return () => { if (tmRef.current.raf) cancelAnimationFrame(tmRef.current.raf); };
  }, [tmRunning]);

  const tmStartPause = () => {
    if (tmAlarm) return;
    if (tmRunning) {
      tmRef.current.pausedLeft = tmRef.current.end - Date.now();
      setTmRunning(false);
    } else {
      if (tmLeft === 0) {
        // Parse inputs to set initial time
        const h = parseInt(tmInputs.h || "0");
        const m = parseInt(tmInputs.m || "0");
        const s = parseInt(tmInputs.s || "0");
        const totalMs = (h * 3600 + m * 60 + s) * 1000;
        if (totalMs <= 0) return;
        setTmTime(totalMs);
        tmRef.current.pausedLeft = totalMs;
      }
      setTmRunning(true);
    }
  };

  const tmReset = () => {
    setTmRunning(false);
    setTmLeft(0);
    setTmTime(0);
    setTmAlarm(false);
    tmRef.current = { end: 0, raf: null, pausedLeft: 0 };
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
  };

  const stopAlarm = () => {
    setTmAlarm(false);
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
  };

  // UI Helpers
  const formatTimerLeft = (ms: number) => {
    const totalS = Math.ceil(ms / 1000);
    const s = totalS % 60;
    const m = Math.floor(totalS / 60) % 60;
    const h = Math.floor(totalS / 3600);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const minLapDiff = laps.length > 1 ? Math.min(...laps.map(l => l.diff)) : null;
  const maxLapDiff = laps.length > 1 ? Math.max(...laps.map(l => l.diff)) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Tabs */}
      <div className="flex bg-secondary/50 rounded-2xl p-1 w-fit mx-auto">
        <button 
          onClick={() => setTab("stopwatch")}
          className={cn("px-6 py-2 rounded-xl text-sm font-semibold transition-all", tab === "stopwatch" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
        >
          {t("tools.stopwatch.tabStopwatch")}
        </button>
        <button 
          onClick={() => setTab("timer")}
          className={cn("px-6 py-2 rounded-xl text-sm font-semibold transition-all", tab === "timer" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
        >
          {t("tools.stopwatch.tabTimer")}
        </button>
      </div>

      <div className="bg-background border border-border rounded-3xl p-6 md:p-10 shadow-sm flex flex-col items-center min-h-[400px]">
        
        {/* --- STOPWATCH --- */}
        {tab === "stopwatch" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95">
            <div className="text-[5rem] md:text-[7rem] font-black tracking-tighter tabular-nums leading-none mb-10 text-primary">
              {formatTimeMs(swTime)}
            </div>

            <div className="flex gap-4">
              <button onClick={swStartPause} className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md">
                {swRunning ? <Icon name="pause" className="w-8 h-8" /> : <Icon name="play" className="w-8 h-8" />}
              </button>
              <button onClick={swLap} disabled={!swRunning} className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all active:scale-95 disabled:opacity-50 shadow-sm">
                {t("tools.stopwatch.lap")}
              </button>
              <button onClick={swReset} disabled={swTime === 0} className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-destructive/10 text-destructive font-bold hover:bg-destructive/20 transition-all active:scale-95 disabled:opacity-50 shadow-sm">
                <Icon name="rotate-ccw" className="w-6 h-6" />
              </button>
            </div>

            {laps.length > 0 && (
              <div className="w-full mt-10 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {laps.map((l) => (
                  <div key={l.lap} className="flex justify-between items-center py-3 border-b border-border/50 text-sm font-medium tabular-nums">
                    <span className="text-muted-foreground w-12">#{l.lap}</span>
                    <span className={cn(
                      "flex-1 text-center",
                      l.diff === minLapDiff ? "text-green-500" : l.diff === maxLapDiff ? "text-red-500" : "text-foreground"
                    )}>
                      +{formatTimeMs(l.diff)}
                    </span>
                    <span className="text-foreground font-bold text-right w-24">{formatTimeMs(l.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TIMER --- */}
        {tab === "timer" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95">
            
            {tmLeft === 0 && !tmRunning && !tmAlarm ? (
              <div className="flex gap-4 mb-10 mt-6">
                <div className="flex flex-col items-center gap-2">
                  <input type="number" min="0" max="99" value={tmInputs.h} onChange={e => setTmInputs({...tmInputs, h: e.target.value})} placeholder="00" className="w-24 h-24 text-center text-5xl font-black bg-secondary/30 border border-border rounded-2xl outline-none focus:border-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.stopwatch.hr")}</span>
                </div>
                <span className="text-5xl font-black mt-4 text-muted-foreground">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" min="0" max="59" value={tmInputs.m} onChange={e => setTmInputs({...tmInputs, m: e.target.value})} placeholder="00" className="w-24 h-24 text-center text-5xl font-black bg-secondary/30 border border-border rounded-2xl outline-none focus:border-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.stopwatch.min")}</span>
                </div>
                <span className="text-5xl font-black mt-4 text-muted-foreground">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" min="0" max="59" value={tmInputs.s} onChange={e => setTmInputs({...tmInputs, s: e.target.value})} placeholder="00" className="w-24 h-24 text-center text-5xl font-black bg-secondary/30 border border-border rounded-2xl outline-none focus:border-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t("tools.stopwatch.sec")}</span>
                </div>
              </div>
            ) : (
              <div className={cn("text-[6rem] md:text-[8rem] font-black tracking-tighter tabular-nums leading-none mb-10 transition-colors", tmAlarm ? "text-destructive animate-pulse" : "text-primary")}>
                {formatTimerLeft(tmLeft)}
              </div>
            )}

            {tmAlarm ? (
              <button onClick={stopAlarm} className="px-8 py-4 bg-destructive text-destructive-foreground font-bold rounded-2xl text-xl hover:bg-destructive/90 transition-all active:scale-95 shadow-lg animate-bounce">
                {t("tools.stopwatch.stopAlarm")}
              </button>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={tmStartPause} 
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md"
                >
                  {tmRunning ? <Icon name="pause" className="w-8 h-8" /> : <Icon name="play" className="w-8 h-8" />}
                </button>
                <button 
                  onClick={tmReset} 
                  disabled={tmLeft === 0 && !tmRunning} 
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-destructive/10 text-destructive font-bold hover:bg-destructive/20 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <Icon name="rotate-ccw" className="w-6 h-6" />
                </button>
              </div>
            )}

            {tmLeft > 0 && tmTime > 0 && (
              <div className="w-full max-w-xs mt-12 bg-secondary/30 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-100 ease-linear" style={{ width: `${(tmLeft / tmTime) * 100}%` }} />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
