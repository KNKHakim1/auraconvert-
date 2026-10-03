import { cn } from "@/lib/cn";

type IconProps = {
  name: string;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const classes = cn("h-5 w-5 shrink-0", className);

  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "tools":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 0 0 5.6-5.6l-2.2 2.2-1.8-1.8 2-2.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "copy":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "refresh":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "trash":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "arrow-up":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "arrow-down":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "qr-code":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14h.01M17 14h4M14 17h4M21 17v4M14 21h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "hash":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "link":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "text":
    case "character-counter":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M5 6h14M12 6v12M8 18h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "pdf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="1.4" fill="currentColor" />
          <path d="m8 16 3-3 3 3 2-2 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "video":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <rect x="3.5" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 10.2 20.5 8v8L16 13.8v-3.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "audio":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "developer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "internet":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 12h16M12 4c2.5 3 2.5 13 0 16M12 4c-2.5 3-2.5 13 0 16" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "files":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M8 7V5a1 1 0 0 1 1-1h6l4 4v11a1 1 0 0 1-1 1h-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="3.5" y="9" width="10" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 13.5 2.5 14.8 3.5 15.8C4.3 16.6 5.4 17 6.5 17H8.5C9.3 17 10 17.7 10 18.5C10 18.9 9.9 19.3 9.6 19.6C9.4 19.9 9.3 20.3 9.3 20.7C9.3 21.4 9.9 22 12 22Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/>
          <circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/>
          <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/>
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "games":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M7 15.5c-2.5 0-4-1.8-4-4.2C3 8.6 5.2 7 8 7h8c2.8 0 5 1.6 5 4.3 0 2.4-1.5 4.2-4 4.2l-2-3h-4l-2 3H7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="9" cy="11" r="0.9" fill="currentColor" />
          <circle cx="15" cy="11" r="0.9" fill="currentColor" />
        </svg>
      );
    case "eraser":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 21H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m5 11 9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10Z" fill="currentColor" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "trending-up":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M22 7l-8 8-4-4-6 6M22 7h-6M22 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "folder":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-1.2-1.8A2 2 0 0 0 7.55 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="m12 3 2.9 6.2 6.7.7-5 4.5 1.4 6.6L12 17.6l-6 3.4 1.4-6.6-5-4.5 6.7-.7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}
