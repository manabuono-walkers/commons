"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

function calcAge(birth: string): number {
  const b = new Date(birth);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

// ※ 表示内容は仮のモックデータ
const PROFILE = {
  photo: "/images/icon.png",
  displayName: "りく",
  birthdate: "2000-08-15",
  gender: "男性",
  residence: "東京都",
  hometown: "神奈川県",
  job: "会社員（総合職）",
  hobby: "ワイン、旅行、写真",
  mbti: "ENFP",
  loveType: "ロマンチスト",
  sns: "https://instagram.com/aoyama_r",
  bio: "ワインと旅が好きです。COMMONS CLUBで色々なジャンルのコミュニティを楽しんでいます。仕事以外のつながりを大切にしたくて入会しました。まだまだ駆け出しですが、信頼できる仲間たちと出会えるのを楽しみにしています。",
  gallery: [
    "/images/wine.png", "/images/bar.png", "/images/cafe.png",
    "/images/gallery.png", "/images/wisky.png", "/images/event1.png",
    "/images/event2.png", "/images/eventrepo.png", "/images/eventrepo2.png",
  ],
};

export default function ProfilePage() {
  const router = useRouter();
  const age = calcAge(PROFILE.birthdate);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const basicInfo = [
    { label: "性別", value: PROFILE.gender },
    { label: "年齢", value: `${age}歳` },
    { label: "居住地", value: PROFILE.residence },
    { label: "出身地", value: PROFILE.hometown },
    { label: "職業", value: PROFILE.job },
    { label: "MBTI", value: PROFILE.mbti },
    { label: "ラブタイプ", value: PROFILE.loveType },
  ];

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="font-display text-sm font-semibold">{PROFILE.displayName}</span>
          <Link href="/profile-edit" className="w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </Link>
        </header>

        {/* プレビューバナー */}
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2.5" style={{ background: "rgba(184,152,90,0.08)", border: "1px solid rgba(184,152,90,0.25)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <p className="font-display text-[11px] text-[var(--color-accent-deep)]">他のユーザーからの見え方をプレビューしています</p>
        </div>

        {/* ヒーロー写真 */}
        <div className="px-4 pt-4">
          <div className="rounded-2xl overflow-hidden border border-[var(--color-line)]" style={{ aspectRatio: "4 / 5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE.photo} alt={PROFILE.displayName} className="w-full h-full object-cover" />
          </div>
        </div>

        <main className="px-5 pt-5 space-y-6">
          {/* 名前・年齢 */}
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-elegant text-3xl">{PROFILE.displayName}</h1>
            <span className="num text-lg text-[var(--color-mute)]">{age}歳</span>
          </div>

          {/* SNSリンク */}
          {PROFILE.sns && (
            <a href={PROFILE.sns} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[var(--color-accent-deep)] hover:underline underline-offset-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              SNSリンク
            </a>
          )}

          {/* 基本情報カード */}
          <section>
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-2">基本情報</div>
            <div className="rounded-2xl overflow-hidden border border-[var(--color-line)]">
              {basicInfo.map((row, i) => (
                <div key={row.label}
                  className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-[var(--color-line)]" : ""}`}
                  style={{ background: "var(--color-bg-soft)" }}>
                  <span className="font-display text-xs text-[var(--color-mute)]">{row.label}</span>
                  <span className="font-display text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 自己紹介 */}
          <section>
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-2">自己紹介</div>
            <div className="rounded-2xl overflow-hidden border border-[var(--color-line)]" style={{ background: "var(--color-bg-soft)" }}>
              {PROFILE.hobby && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-display text-xs text-[var(--color-mute)]">趣味・好きなこと</span>
                  <span className="font-display text-sm text-right ml-4">{PROFILE.hobby}</span>
                </div>
              )}
              <div className={`px-4 py-3.5 ${PROFILE.hobby ? "border-t border-[var(--color-line)]" : ""}`}>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed whitespace-pre-line">{PROFILE.bio}</p>
              </div>
            </div>
          </section>

          {/* ギャラリー */}
          <section>
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">ギャラリー</div>
            <div className="grid grid-cols-3 gap-1.5">
              {PROFILE.gallery.map((img, i) => (
                <button key={i} onClick={() => setLightbox(img)}
                  className="aspect-square rounded-lg overflow-hidden border border-[var(--color-line)] hover:opacity-90 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          {/* 編集へ */}
          <Link href="/profile-edit"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-[var(--color-line)] font-display text-sm text-[var(--color-mute)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            プロフィールを編集する
          </Link>
        </main>

        {/* ギャラリー拡大表示 */}
        {lightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="w-full max-w-[430px] px-4" onClick={e => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox} alt="" className="w-full rounded-2xl" style={{ maxHeight: "80vh", objectFit: "contain" }} />
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
