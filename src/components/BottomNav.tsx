"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconEvent({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <rect x="7" y="14" width="2" height="2" rx="0.3" fill={c} stroke="none" />
      <rect x="11" y="14" width="2" height="2" rx="0.3" fill={c} stroke="none" />
      <rect x="15" y="14" width="2" height="2" rx="0.3" fill={c} stroke="none" />
      <rect x="7" y="18" width="2" height="2" rx="0.3" fill={c} stroke="none" />
      <rect x="11" y="18" width="2" height="2" rx="0.3" fill={c} stroke="none" />
    </svg>
  );
}

function IconClubs({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {/* Top center person */}
      <circle cx="16" cy="5.5" r="2.8" />
      <path d="M10.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      {/* Bottom left person */}
      <circle cx="6.5" cy="19" r="2.8" />
      <path d="M1 27c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      {/* Bottom right person */}
      <circle cx="25.5" cy="19" r="2.8" />
      <path d="M20 27c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    </svg>
  );
}

function IconStore({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Martini glass */}
      <path d="M5 4h14L12 14z" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
      {/* Garnish circle */}
      <circle cx="18" cy="6" r="2.2" />
    </svg>
  );
}

function IconTimeline({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Vertical connecting line */}
      <line x1="5" y1="4" x2="5" y2="22" stroke={c} strokeWidth="1.6" />
      {/* 3 timeline nodes */}
      <circle cx="5" cy="4" r="2.2" fill={c} />
      <circle cx="5" cy="13" r="2.2" fill={c} />
      <circle cx="5" cy="22" r="2.2" fill={c} />
      {/* Top label arrow */}
      <path d="M9 1.5h9l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
      {/* Middle label arrow */}
      <path d="M9 10.5h10l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
      {/* Bottom label arrow */}
      <path d="M9 19.5h8l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}

function IconMypage({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Person in circle (keyhole shape) */}
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="9" r="3" />
      <path d="M5.5 20.5a7 7 0 0 1 13 0" />
    </svg>
  );
}

const tabs = [
  { href: "/home",      label: "ホーム",       Icon: IconHome },
  { href: "/events",    label: "イベント",     Icon: IconEvent },
  { href: "/community", label: "タイムライン", Icon: IconTimeline },
  { href: "/clubs",     label: "クラブ",       Icon: IconClubs },
  { href: "/stores",    label: "店舗",         Icon: IconStore },
  { href: "/mypage",    label: "マイページ",   Icon: IconMypage },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-[430px] flex border-t border-[var(--color-line)] bg-[var(--color-bg)]/95 backdrop-blur-md pb-safe">
        {tabs.map((t) => {
          const active = path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-1 flex-col items-center gap-1 py-3 transition-all"
            >
              <t.Icon active={active} />
              <span
                className="font-display text-[10px] tracking-wider"
                style={{ color: active ? "var(--color-accent-deep)" : "var(--color-mute)" }}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
