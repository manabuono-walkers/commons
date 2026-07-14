"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    section: "分析",
    items: [
      { href: "/admin", label: "分析・BI", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    ],
  },
  {
    section: "会員",
    items: [
      { href: "/admin/members", label: "会員管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { href: "/admin/screening", label: "審査管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, badge: 2 },
    ],
  },
  {
    section: "売上",
    items: [
      { href: "/admin/revenue", label: "売上管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    ],
  },
  {
    section: "コンテンツ",
    items: [
      { href: "/admin/events", label: "イベント管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
      { href: "/admin/notifications", label: "通知・配信", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
      { href: "/admin/content", label: "コンテンツ管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
      { href: "/admin/clubs", label: "クラブ管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg> },
    ],
  },
  {
    section: "サービス",
    items: [
      { href: "/admin/coupons", label: "クーポン管理", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
      { href: "/admin/points", label: "ポイント・ランク", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
      { href: "/admin/stores", label: "提携店舗", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    ],
  },
  {
    section: "サポート",
    items: [
      { href: "/admin/feedback", label: "意見箱", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>, badge: 2 },
    ],
  },
  {
    section: "システム",
    items: [
      { href: "/admin/settings", label: "管理者設定", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] flex flex-col border-r border-[var(--color-line)] bg-[var(--color-bg-soft)] z-40">
      <div className="px-5 py-5 border-b border-[var(--color-line)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="COMMONS" style={{ height: 22, width: "auto", objectFit: "contain" }} />
        <div className="font-display text-[10px] tracking-[0.15em] text-[var(--color-mute)] mt-1.5">管理コンソール</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {nav.map((group) => (
          <div key={group.section} className="mb-4">
            <div className="font-display text-[9px] tracking-[0.15em] text-[var(--color-mute)] px-3 py-1.5 uppercase">{group.section}</div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 font-display text-xs transition-all ${active ? "bg-[var(--color-accent)]/12 text-[var(--color-accent-deep)]" : "text-[var(--color-ink)]/70 hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)]"}`}>
                  <span className={active ? "text-[var(--color-accent-deep)]" : "text-[var(--color-mute)]"}>{item.icon}</span>
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-auto w-4 h-4 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[9px] font-display">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
