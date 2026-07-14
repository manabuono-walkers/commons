"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "マイページ" },
  { href: "/events", label: "イベント" },
  { href: "/map", label: "店舗マップ" },
  { href: "/apply", label: "入会申込" },
  { href: "/admin", label: "運営管理" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-2xl tracking-[0.18em] md:text-3xl">
          COMMONS
        </Link>

        <nav className="hidden gap-10 md:flex">
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`font-display text-sm link-underline ${
                  active ? "text-[var(--color-accent-deep)]" : "text-[var(--color-ink)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="font-display text-sm link-underline">
            サインイン
          </Link>
          <Link href="/apply" className="btn-primary !py-2 !px-5 text-xs">
            入会申込
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden font-display text-sm"
          aria-label="メニュー"
        >
          {open ? "閉じる" : "メニュー"}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-bg)] md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {[...nav, { href: "/login", label: "サインイン" }].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--color-line)] py-4 font-display text-sm last:border-none"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
