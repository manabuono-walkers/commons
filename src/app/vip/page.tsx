"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const benefits = [
  { icon: "◆", purple: true, title: "全イベント優先予約", desc: "一般募集開始の48時間前から予約が可能。人気イベントも確実に参加できます。" },
  { icon: "◆", purple: true, title: "VIP限定イベントへの招待", desc: "著名シェフ・生産者を招いた非公開ディナー、プライベートセラー見学など、VIP会員のみが参加できる特別なイベントに招待されます。" },
  { icon: "◆", purple: true, title: "提携店舗 最大30%OFF", desc: "通常会員10〜20%OFFに対し、VIPは最大30%OFFで利用可能。La Cave、Coffee Commonsなど全提携店舗が対象。" },
  { icon: "◆", purple: true, title: "専任コンシェルジュ対応", desc: "専任スタッフが24時間以内にご要望に対応。イベントのご相談から特別リクエストまでお任せください。" },
  { icon: "◆", purple: true, title: "毎月限定ギフト", desc: "厳選ワイン・コーヒー豆・アルチザンチョコレートなどのギフトボックスを毎月お届けします。" },
  { icon: "◆", purple: true, title: "会員証のゴールドVIPデザイン", desc: "特別デザインのVIPゴールド会員証が発行されます。提携店舗では最上級の対応を受けられます。" },
];

export default function VipPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">VIPプランへようこそ</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            アップグレードが完了しました。<br />次回のVIP限定イベントのご案内をお楽しみに。
          </p>
          <Link href="/mypage" className="btn-primary justify-center">マイページへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
              ← 戻る
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            <div className="w-14" />
          </div>
        </header>

        {/* Hero — purple */}
        <div className="relative px-5 pt-10 pb-8 text-center border-b border-[var(--color-line)] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(88,28,135,0.22) 0%, rgba(49,10,82,0.35) 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)" }} />
          <div className="relative">
            <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.25), rgba(109,40,217,0.15))", border: "1px solid rgba(167,139,250,0.45)" }}>
              <span className="font-display text-xs tracking-[0.2em]" style={{ color: "#c084fc" }}>COMMONS VIP</span>
            </div>
            <h1 className="font-display text-3xl leading-tight mb-3">
              最高の体験を、<br />あなただけに。
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#9f8fc0" }}>
              VIPプランは、COMMONSの全機能を最上位で享受できる特別なメンバーシップです。
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-5 py-8 space-y-5 border-b border-[var(--color-line)]">
          <h2 className="font-display text-lg mb-4">VIP特典</h2>
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-none font-display text-xs mt-1" style={{ color: "#c084fc" }}>{b.icon}</span>
              <div>
                <div className="font-display text-sm mb-0.5">{b.title}</div>
                <div className="text-xs text-[var(--color-mute)] leading-relaxed">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing — purple */}
        <div className="px-5 py-8 border-b border-[var(--color-line)]">
          <h2 className="font-display text-lg mb-5">料金</h2>
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a2e, #2d1157, #1a0a2e)", border: "1px solid rgba(167,139,250,0.35)" }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(147,51,234,0.3) 0%, transparent 70%)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(192,132,252,0.15) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="font-display text-[10px] tracking-[0.2em] mb-4" style={{ color: "#c084fc" }}>VIPプラン</div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="num text-4xl" style={{ color: "#e9d5ff" }}>¥2,980</span>
                <span className="font-display text-sm pb-1" style={{ color: "#a78bfa" }}>税込/月</span>
              </div>
              <p className="font-display text-xs mb-4" style={{ color: "#7c6fa0" }}>年間一括: ¥29,800（2ヶ月分お得）</p>
              <div className="pt-4 space-y-1.5 text-xs" style={{ borderTop: "1px solid rgba(167,139,250,0.2)", color: "#7c6fa0" }}>
                <p>· 現在の月額/年間プランとの差額のみお支払い</p>
                <p>· いつでもダウングレード可能</p>
                <p>· 初月はVIP特典を即日開放</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-8 space-y-3">
          <button
            onClick={() => setDone(true)}
            className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "#fff", boxShadow: "0 4px 20px rgba(168,85,247,0.3)" }}
          >
            VIPプランにアップグレード
          </button>
          <button
            onClick={() => router.back()}
            className="w-full btn-outline justify-center"
          >
            戻る
          </button>
          <p className="text-[10px] text-[var(--color-mute)] text-center leading-relaxed">
            決済ボタンを押すことで、VIPプラン利用規約に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
