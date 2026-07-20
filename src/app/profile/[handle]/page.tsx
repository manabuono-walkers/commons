"use client";
import { use } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

interface ProfileData {
  name: string; handle: string; avatar: string; avatarText?: string;
  rank: string; job: string; location: string; bio: string;
  clubs: { id: string; name: string; icon: string }[];
}

const PROFILES: Record<string, ProfileData> = {
  tanaka_k: {
    name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png",
    rank: "GOLD", job: "不動産会社 代表", location: "東京",
    bio: "不動産会社を経営しています。ワインとフォトグラフィーが趣味。Leica M11で街の光と影を追いかけています。ビジネス外の豊かな繋がりを求めてCOMMONSへ。",
    clubs: [
      { id: "wine", name: "ワインクラブ", icon: "🍷" },
      { id: "photo", name: "フォトクラブ", icon: "📷" },
    ],
  },
  yamamoto_a: {
    name: "山本 彩花", handle: "@yamamoto_a", avatar: "/images/yamamoto.png",
    rank: "PLATINUM", job: "フリーランスデザイナー", location: "東京",
    bio: "UI/UXデザインを中心に活動しています。旅と写真が大好きで、週末はどこかへ出かけています。箱根や軽井沢が特に好き。COMMONSでは素敵な出会いを楽しんでいます。",
    clubs: [
      { id: "travel", name: "旅クラブ", icon: "✈️" },
      { id: "photo", name: "フォトクラブ", icon: "📷" },
      { id: "wine", name: "ワインクラブ", icon: "🍷" },
    ],
  },
  ito_k: {
    name: "伊藤 健", handle: "@ito_k", avatar: "/images/ito.png",
    rank: "SILVER", job: "ソフトウェアエンジニア", location: "東京",
    bio: "都内のスタートアップでエンジニアをしています。登山とコーヒーが趣味。百名山制覇を目標に週末は山へ。雲取山から望む富士山が忘れられません。",
    clubs: [
      { id: "outdoor", name: "アウトドアクラブ", icon: "🏔" },
      { id: "coffee", name: "コーヒークラブ", icon: "☕" },
    ],
  },
};

export default function MemberProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const profile = PROFILES[handle];

  if (!profile) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex items-center justify-center">
          <p className="font-display text-sm text-[var(--color-mute)]">プロフィールが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 space-y-6">
          {/* アバター・ハンドルネーム */}
          <section className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover flex-none border-2 border-[var(--color-line)]" />
            <div className="flex-1 min-w-0 pt-1">
              <div className="font-display text-base font-semibold text-[var(--color-ink)]">{profile.name}</div>
              <div className="font-display text-sm text-[var(--color-mute)] mt-0.5">{profile.handle}</div>
              <span className="tag text-[9px] px-2 py-0.5 mt-1 inline-block">{profile.rank}</span>
            </div>
          </section>

          {/* 自己紹介 */}
          <section>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{profile.bio}</p>
          </section>

          {/* 職業・居住地 */}
          <section className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-mute)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span className="font-display">{profile.job}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-mute)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="font-display">{profile.location}</span>
            </div>
          </section>

          {/* 参加クラブ */}
          <section>
            <div className="font-display text-xs text-[var(--color-mute)] mb-3">参加中のクラブ</div>
            <div className="flex gap-2 flex-wrap">
              {profile.clubs.map(c => (
                <Link key={c.id} href={`/clubs/${c.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] hover:border-[var(--color-accent)]/50 transition">
                  <span className="text-base leading-none">{c.icon}</span>
                  <span className="font-display text-xs">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* DMボタン */}
          <Link
            href="/community"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-[var(--color-line)] font-display text-sm text-[var(--color-mute)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            DM を送る
          </Link>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
