"use client";
import { use, useState } from "react";
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
  const [showReport, setShowReport] = useState(false);
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);

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

          {/* 通報ボタン */}
          <button
            onClick={() => { setShowReport(true); setReported(false); setReportDetail(""); }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-[var(--color-line)] font-display text-sm text-red-400/80 hover:border-red-400/40 hover:text-red-400 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
            通報する
          </button>
        </main>

        <BottomNav />

        {/* ===== 通報モーダル ===== */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => { setShowReport(false); setReportDetail(""); }}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <div className="px-5 mb-5">
                <div className="font-display text-base font-semibold mb-1">通報する</div>
                <div className="font-display text-xs text-[var(--color-mute)]">{profile.name} を通報する内容を入力してください</div>
              </div>
              {reported ? (
                <div className="px-5 py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: "rgba(184,152,90,0.15)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="font-display text-sm text-[var(--color-ink)]">通報を受け付けました</div>
                  <div className="font-display text-xs text-[var(--color-mute)]">運営が確認し、適切に対応します</div>
                  <button onClick={() => setShowReport(false)} className="mt-2 w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] transition hover:text-[var(--color-ink)]">閉じる</button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <div className="px-1 mb-3">
                    <textarea
                      value={reportDetail}
                      onChange={e => setReportDetail(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                      placeholder="通報の理由・内容を自由にご記入ください"
                      rows={5}
                      style={{ transition: "border-color 0.2s" }}
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--color-accent)"}
                      onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--color-line)"}
                    />
                  </div>
                  <button
                    disabled={!reportDetail.trim()}
                    onClick={() => setReported(true)}
                    className="w-full py-3.5 rounded-full font-display text-sm transition disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white" }}
                  >
                    送信する
                  </button>
                  <button onClick={() => { setShowReport(false); setReportDetail(""); }} className="w-full mt-2 py-3.5 rounded-2xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition">
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
