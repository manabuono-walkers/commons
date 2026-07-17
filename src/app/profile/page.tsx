"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const joinedClubs = [
  { id: "wine",   name: "ワインクラブ",  icon: "🍷" },
  { id: "travel", name: "旅クラブ",      icon: "✈️" },
];

export default function ProfilePage() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/profile-edit" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* 他ユーザー目線のバナー */}
        <div className="mx-5 mt-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: "rgba(184,152,90,0.08)", border: "1px solid rgba(184,152,90,0.25)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <p className="font-display text-xs text-[var(--color-accent-deep)]">他のユーザーからの見え方をプレビューしています</p>
        </div>

        <main className="px-5 pt-6 space-y-6">
          {/* アバター・ハンドルネーム */}
          <section className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon.png" alt="アバター" className="w-20 h-20 rounded-full object-cover flex-none border-2 border-[var(--color-line)]" />
            <div className="flex-1 min-w-0 pt-2">
              <div className="font-display text-sm text-[var(--color-mute)]">@aoyama_r</div>
            </div>
          </section>

          {/* 自己紹介 */}
          <section>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              ワインと旅が好きです。COMMONS CLUBで色々なジャンルのコミュニティを楽しんでいます。
            </p>
          </section>

          {/* 参加クラブ */}
          <section>
            <div className="font-display text-xs text-[var(--color-mute)] mb-3">参加中のクラブ</div>
            <div className="flex gap-2 flex-wrap">
              {joinedClubs.map(c => (
                <Link key={c.id} href={`/clubs/${c.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] hover:border-[var(--color-accent)]/50 transition">
                  <span className="text-base leading-none">{c.icon}</span>
                  <span className="font-display text-xs">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 編集へ戻る */}
          <Link
            href="/profile-edit"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-[var(--color-line)] font-display text-sm text-[var(--color-mute)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            プロフィールを編集する
          </Link>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
