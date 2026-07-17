"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { events, CommonsLogo } from "../page";

const TERMS_TEXT = `【COMMONSイベント参加規約】

第1条（参加条件）
本イベントへの参加は、COMMONS会員に限ります。参加申込時点で有効な会員資格を有している必要があります。

第2条（キャンセルポリシー）
・募集期間中のキャンセルは参加費を全額返金いたします。
・開催15日前までのキャンセルは参加費の半額を返金いたします。
・開催14日前以降のキャンセルは返金対象外となります。

第3条（禁止事項）
・会員以外の方の同伴（許可なし）
・会場内での撮影・録音（スタッフの指示に従ってください）
・他の参加者への勧誘・営業行為

第4条（免責事項）
天災その他不可抗力により中止となった場合、参加費の返金対応を行います。会場への往復に関わる費用は参加者負担となります。

第5条（個人情報の取り扱い）
申込情報は本イベントの運営・連絡目的のみに使用します。第三者への提供は行いません。`;

export default function EventDetailClient({ id }: { id: string }) {
  const ev = events.find(e => e.id === id) ?? events[0];
  const [cancelWait, setCancelWait] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const router = useRouter();

  const showMaleRemaining = ev.remaining_male < ev.alert_threshold;
  const showFemaleRemaining = ev.remaining_female < ev.alert_threshold;
  const maleSoldOut = ev.remaining_male <= 0;
  const femaleSoldOut = ev.remaining_female <= 0;

  const heroImg = (ev as any).detailImage ?? ev.image;

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header with back button */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <Link href="/events" className="flex items-center gap-1.5 font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
              ← 戻る
            </Link>
            <CommonsLogo size={20} />
            <span className="inline-block bg-[var(--color-accent)] text-[var(--color-bg)] font-display text-[10px] tracking-wider px-3 py-1 rounded">
              {ev.state}
            </span>
          </div>
        </header>

        {/* Hero — photo only, no text overlay */}
        <div
          className="h-[260px] bg-cover bg-center"
          style={heroImg.startsWith("/") ? { backgroundImage: `url(${heroImg})` } : { background: heroImg }}
        />

        {/* Title */}
        <div className="px-5 pt-7 pb-5 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1.5">COMMONS EVENT</p>
          <h1 className="font-display text-3xl leading-tight">{ev.title}</h1>
        </div>

        {/* Description */}
        <div className="px-5 py-6 border-b border-[var(--color-line)]">
          <p className="text-sm text-[var(--color-ink-soft)] leading-[1.9]">{ev.desc}</p>
        </div>

        {/* Details */}
        <div className="px-5 py-6 space-y-5 border-b border-[var(--color-line)]">
          <DetailRow label="日時">
            {ev.datetime_detail.split("\n").map((l, i) => (
              <p key={i} className={i > 0 ? "text-xs text-[var(--color-mute)] mt-0.5" : ""}>{l}</p>
            ))}
          </DetailRow>

          <DetailRow label="場所">
            <a
              href={ev.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[var(--color-accent)]/60 hover:text-[var(--color-accent-deep)] transition"
            >
              {ev.venue}
            </a>
            <p className="text-xs text-[var(--color-mute)] mt-0.5">{ev.station}</p>
          </DetailRow>

          <DetailRow label="参加費">
            <p>男性 {ev.fee_male} / 女性 {ev.fee_female}</p>
          </DetailRow>

          <DetailRow label="形式">
            <p>{ev.format}</p>
          </DetailRow>

          <DetailRow label="募集人数">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>男性</span>
                <span className="num">
                  {ev.capacity_male}名定員
                  {ev.remaining_male <= 0
                    ? <span className="ml-2 text-xs text-[var(--color-mute)]">（満席）</span>
                    : ev.remaining_male < ev.alert_threshold
                      ? <span className="ml-2 text-xs text-[var(--color-accent-deep)]">（残り{ev.remaining_male}名）</span>
                      : null}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--color-line)] rounded-full">
                <div className="h-1.5 rounded-full bg-[var(--color-accent)]" style={{ width: `${Math.round((1 - ev.remaining_male / ev.capacity_male) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>女性</span>
                <span className="num">
                  {ev.capacity_female}名定員
                  {ev.remaining_female <= 0
                    ? <span className="ml-2 text-xs text-[var(--color-mute)]">（満席）</span>
                    : ev.remaining_female < ev.alert_threshold
                      ? <span className="ml-2 text-xs text-[var(--color-accent-deep)]">（残り{ev.remaining_female}名）</span>
                      : null}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--color-line)] rounded-full">
                <div className="h-1.5 rounded-full bg-[var(--color-accent)]" style={{ width: `${Math.round((1 - ev.remaining_female / ev.capacity_female) * 100)}%` }} />
              </div>
            </div>
          </DetailRow>

          <DetailRow label="募集締め切り">
            <p>{ev.deadline}</p>
          </DetailRow>

          <DetailRow label="お支払い方法">
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              以下の参加規約をご確認の上、同意いただいた後にお支払いへ進んでください。
            </p>

            {/* Inline terms UI */}
            <div className="mt-3 rounded-xl overflow-hidden border border-[var(--color-line)]">
              <div className="bg-[var(--color-bg-soft)] px-4 py-2 border-b border-[var(--color-line)]">
                <p className="font-display text-[10px] text-[var(--color-accent-deep)] tracking-wide">参加規約</p>
              </div>
              <div
                className="h-[160px] overflow-y-auto px-4 py-3 text-xs text-[var(--color-mute)] leading-relaxed whitespace-pre-wrap"
                style={{ background: "var(--color-bg)" }}
              >
                {TERMS_TEXT}
              </div>
            </div>

            {/* Agree checkbox */}
            <label className="mt-4 flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-none mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                />
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    background: agreedTerms ? "linear-gradient(135deg, #CBAE74, #B8985A)" : "var(--color-bg-soft)",
                    border: agreedTerms ? "none" : "1px solid var(--color-line)",
                  }}
                >
                  {agreedTerms && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-display text-sm text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-accent-deep)] transition">
                上記の参加規約を確認し、同意します
              </span>
            </label>
          </DetailRow>
        </div>

        {/* 参加メンバーリスト */}
        <div className="px-5 py-6 border-b border-[var(--color-line)]">
          <p className="font-display text-[11px] text-[var(--color-accent-deep)] mb-4 flex items-center gap-1.5">
            <span className="text-[var(--color-accent)]">■</span> 参加メンバー
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "田中 康介", avatar: "/images/tanaka.png" },
              { name: "山本 彩花", avatar: "/images/yamamoto.png" },
              { name: "伊藤 健", avatar: "/images/ito.png" },
              { name: "中村 優一", avatar: "中" },
              { name: "鈴木 花", avatar: "鈴" },
              { name: "渡辺 直人", avatar: "渡" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {m.avatar.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-[var(--color-line)]" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]">{m.avatar}</div>
                )}
                <span className="font-display text-[9px] text-[var(--color-mute)] text-center max-w-[56px] leading-tight">{m.name.split(" ")[0]}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-line)] font-display text-xs text-[var(--color-mute)] border border-[var(--color-line)]">他8名</div>
              <span className="font-display text-[9px] text-[var(--color-mute)]"> </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="px-5 py-8">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] text-center mb-1">Payment</p>
          <h2 className="font-display text-2xl text-center mb-3">お支払い</h2>

          {!agreedTerms && (
            <p className="font-display text-xs text-[var(--color-mute)] text-center mb-5">
              参加規約に同意するとお支払いボタンが有効になります
            </p>
          )}

          <div className="space-y-4 mt-4">
            {maleSoldOut ? (
              <button disabled className="w-full py-4 rounded-full font-display text-base bg-[var(--color-bg-soft)] text-[var(--color-mute)] border border-[var(--color-line)] cursor-not-allowed">
                男性 — 満席
              </button>
            ) : (
              <button
                onClick={() => agreedTerms && router.push(`/events/${ev.id}/payment?gender=male`)}
                disabled={!agreedTerms}
                className="block w-full py-4 rounded-full font-display text-base text-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={agreedTerms ? { background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" } : { background: "var(--color-bg-soft)", color: "var(--color-mute)", border: "1px solid var(--color-line)" }}
              >
                男性はこちら{showMaleRemaining && agreedTerms && <span className="ml-2 opacity-80">｜ 残り{ev.remaining_male}名</span>}
              </button>
            )}

            {femaleSoldOut ? (
              <button disabled className="w-full py-4 rounded-full font-display text-base bg-[var(--color-bg-soft)] text-[var(--color-mute)] border border-[var(--color-line)] cursor-not-allowed">
                女性 — 満席
              </button>
            ) : (
              <button
                onClick={() => agreedTerms && router.push(`/events/${ev.id}/payment?gender=female`)}
                disabled={!agreedTerms}
                className="block w-full py-4 rounded-full font-display text-base text-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={agreedTerms ? { background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" } : { background: "var(--color-bg-soft)", color: "var(--color-mute)", border: "1px solid var(--color-line)" }}
              >
                女性はこちら{showFemaleRemaining && agreedTerms && <span className="ml-2 opacity-80">｜ 残り{ev.remaining_female}名</span>}
              </button>
            )}

            {(maleSoldOut || femaleSoldOut) && !cancelWait && (
              <button
                onClick={() => setCancelWait(true)}
                className="w-full py-3 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-deep)] transition mt-2"
              >
                キャンセル通知を希望する
              </button>
            )}
            {cancelWait && (
              <div className="text-center py-3">
                <p className="font-display text-sm text-[var(--color-accent-deep)]">✓ キャンセル待ち登録しました</p>
                <p className="text-xs text-[var(--color-mute)] mt-1">空きが出た際にお知らせします</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer logo */}
        <div className="border-t border-[var(--color-line)] py-8 flex justify-center">
          <CommonsLogo size={24} />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-[11px] text-[var(--color-accent-deep)] mb-1.5 flex items-center gap-1.5">
        <span className="text-[var(--color-accent)]">■</span> {label}
      </p>
      <div className="text-sm text-[var(--color-ink)] leading-relaxed pl-3.5">
        {children}
      </div>
    </div>
  );
}
