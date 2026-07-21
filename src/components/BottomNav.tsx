"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

function IconTimeline({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="4" x2="5" y2="22" stroke={c} strokeWidth="1.6" />
      <circle cx="5" cy="4" r="2.2" fill={c} />
      <circle cx="5" cy="13" r="2.2" fill={c} />
      <circle cx="5" cy="22" r="2.2" fill={c} />
      <path d="M9 1.5h9l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M9 10.5h10l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M9 19.5h8l3 2.5-3 2.5H9z" fill="none" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}

function IconClubs({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="5.5" r="2.8" />
      <path d="M10.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="6.5" cy="19" r="2.8" />
      <path d="M1 27c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="25.5" cy="19" r="2.8" />
      <path d="M20 27c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    </svg>
  );
}

function IconMap({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

function IconMypage({ active }: { active: boolean }) {
  const c = active ? "var(--color-accent-deep)" : "var(--color-mute)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="9" r="3" />
      <path d="M5.5 20.5a7 7 0 0 1 13 0" />
    </svg>
  );
}

const tabs = [
  { href: "/events",    label: "イベント",     Icon: IconEvent },
  { href: "/community", label: "タイムライン", Icon: IconTimeline },
  { href: "/clubs",     label: "クラブ",       Icon: IconClubs },
  { href: "/stores",    label: "マップ",       Icon: IconMap },
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
