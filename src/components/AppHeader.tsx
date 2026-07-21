"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export default function AppHeader({ backHref, rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div className="flex-1">
          {backHref && (
            <Link href={backHref} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition whitespace-nowrap">
              ← 戻る
            </Link>
          )}
        </div>

        {/* Center: logo always */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} className="absolute left-1/2 -translate-x-1/2" />

        {/* Right */}
        <div className="flex-1 flex items-center gap-3 justify-end">
          {rightSlot ?? (backHref ? <span className="w-8" /> : <DefaultNavIcons />)}
        </div>
      </div>
    </header>
  );
}

export function DefaultNavIcons() {
  return (
    <>
      {/* Bell icon */}
      <Link href="/notifications" className="relative w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[9px] flex items-center justify-center font-display leading-none">
          3
        </span>
      </Link>
      {/* Avatar */}
      <Link href="/mypage" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon.png" alt="アカウント" className="w-8 h-8 rounded-full object-cover border border-[var(--color-line)]" />
      </Link>
    </>
  );
}
