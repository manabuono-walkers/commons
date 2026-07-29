"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const benefits = [
  {
    title: "① 全国エリア利用",
    points: [
      "東京・大阪・福岡・名古屋など、COMMONSがある全エリアのイベントへ申込み可能",
      "今後追加される対象エリアも利用可能",
    ],
  },
  {
    title: "② イベントの先行予約権",
    points: ["すべてのイベントを、一般会員より48時間早く予約可能"],
  },
  {
    title: "③ キャンセル待ち優先案内",
    points: ["満席イベントに空席が発生した場合、一般会員より優先して案内する"],
  },
  {
    title: "④ AI店舗コンシェルジュ",
    points: [
      "株式会社ONE LIKEの飲食店データベース（一次情報）を活用し、条件に合う店舗をAIが自動で提案する。",
    ],
  },
  {
    title: "⑤ 特別企画",
    points: ["PRIME会員向けの特別企画を不定期で案内する場合がある。"],
  },
];

const NOTES_TEXT = `・申請＋承認制
・各エリアで上限人数あり
・PRIMEへの加入は料金プランの変更として扱う。既存会員がPRIMEへ変更した場合、旧料金の適用資格は終了する。
・PRIME先行予約枠には上限があり、予約を保証するものではない
・満席優先通知は予約を保証するものではない
・AI店舗コンシェルジュについて、以下は対象外とする。
　- 店舗の予約代行
　- 店舗との交渉
　- 満席店の特別手配
　- 旅行・宿泊・航空券の手配
　- 24時間対応
　- 緊急対応
　- 会員の紹介やマッチング
　店舗の営業時間、料金、営業状況等は変更される場合があるため、利用前に会員自身で店舗の公式情報を確認すること。
・特別企画について
　- 開催回数は保証しない
　- 各エリアでの開催を保証しない
・PRIMEであってもイベント参加は保証しない
・イベントのキャンセル規定は一般会員と同様に適用する
・無断欠席、権利の譲渡・転売、制度の不正利用は禁止する
・一般会員が不利益を受けないよう、特典の利用条件を変更する場合がある
・重大な規約違反があった場合は、PRIME資格を停止または取り消す
・資格停止・取消しの場合、原則として料金は返金しない

【PRIMEの更新・退会】
初年度は自動更新を行わず、契約満了前に継続意思と利用状況を確認する。
・継続には定員の空きおよび運営の承認が必要
・契約期間途中の退会による日割り返金は行わない
・PRIME終了後に通常会員へ戻る場合は、その時点の新料金を適用する
・PRIME終了後、通常会員へ移行せず退会する場合は、退会後1年間再入会できない`;

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
          <h1 className="font-display text-2xl mb-2">PRIMEプランへのお申し込みを受け付けました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            PRIMEは申請＋承認制です。審査結果が出るまで今しばらくお待ちください。<br />承認され次第、PRIME特典をご利用いただけます。
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
              <span className="font-display text-xs tracking-[0.2em]" style={{ color: "#c084fc" }}>COMMONS PRIME</span>
            </div>
            <h1 className="font-display text-3xl leading-tight mb-3">
              最高の体験を、<br />あなただけに。
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#9f8fc0" }}>
              PRIMEプランは、COMMONSの全機能を最上位で享受できる特別なメンバーシップです。
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-5 py-8 space-y-6 border-b border-[var(--color-line)]">
          <h2 className="font-display text-lg mb-4">▼メリット</h2>
          {benefits.map((b, i) => (
            <div key={i}>
              <div className="font-display text-sm mb-1.5">{b.title}</div>
              <ul className="space-y-1">
                {b.points.map((p, j) => (
                  <li key={j} className="flex gap-1.5 text-xs text-[var(--color-mute)] leading-relaxed">
                    <span className="flex-none" style={{ color: "#c084fc" }}>・</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing — purple */}
        <div className="px-5 py-8 border-b border-[var(--color-line)]">
          <h2 className="font-display text-lg mb-5">▼料金</h2>
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a2e, #2d1157, #1a0a2e)", border: "1px solid rgba(167,139,250,0.35)" }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(147,51,234,0.3) 0%, transparent 70%)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(192,132,252,0.15) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="font-display text-[10px] tracking-[0.2em] mb-4" style={{ color: "#c084fc" }}>PRIMEプラン</div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="num text-4xl" style={{ color: "#e9d5ff" }}>¥29,800</span>
                <span className="font-display text-sm pb-1" style={{ color: "#a78bfa" }}>税込/年</span>
              </div>
              <div className="pt-4 space-y-1.5 text-xs" style={{ borderTop: "1px solid rgba(167,139,250,0.2)", color: "#7c6fa0" }}>
                <p>· 申請＋承認制（審査の上、承認された方のみご利用いただけます）</p>
                <p>· 各エリアで受入上限人数があります</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="px-5 py-8 border-b border-[var(--color-line)]">
          <h2 className="font-display text-lg mb-4">▼注意事項</h2>
          <div className="rounded-xl overflow-hidden border border-[var(--color-line)]">
            <div
              className="h-[220px] overflow-y-auto px-4 py-3 text-xs text-[var(--color-mute)] leading-relaxed whitespace-pre-wrap"
              style={{ background: "var(--color-bg)" }}
            >
              {NOTES_TEXT}
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
            PRIMEプランに申し込む
          </button>
          <button
            onClick={() => router.back()}
            className="w-full btn-outline justify-center"
          >
            戻る
          </button>
          <p className="text-[10px] text-[var(--color-mute)] text-center leading-relaxed">
            お申し込みボタンを押すことで、上記メリット・料金・注意事項に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
