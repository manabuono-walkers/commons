"use client";
import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { events } from "../../page";

const availableCoupons = [
  { id: "cp001", shop: "La Cave", title: "イベント1000円オフ", discount: 1000, expiry: "2026.08.31" },
  { id: "cp002", shop: "SOUND BAR HOWL", title: "入場料20% OFF", discount: 800, expiry: "2026.09.30" },
];

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const gender = searchParams?.get("gender") ?? "male";

  const ev = events.find(e => e.id === id) ?? events[0];
  const fee = gender === "male" ? ev.fee_male : ev.fee_female;
  const feeNum = parseInt(fee.replace(/[^0-9]/g, ""));
  const genderLabel = gender === "male" ? "男性" : "女性";

  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const selectedCoupon = availableCoupons.find(c => c.id === selectedCouponId) ?? null;
  const appliedDiscount = selectedCoupon?.discount ?? 0;
  const total = Math.max(0, feeNum - appliedDiscount);

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">お支払い完了</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-2">{ev.title}</p>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">{genderLabel} · ¥{total.toLocaleString()}</p>
          <p className="text-xs text-[var(--color-mute)] leading-relaxed mb-8">
            参加登録が完了しました。<br />詳細は登録メールアドレスにお送りします。
          </p>
          <Link href="/events" className="btn-primary justify-center">イベント一覧へ戻る</Link>
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

        <div className="px-5 pt-8">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">Payment</p>
          <h1 className="font-display text-2xl mb-6">お支払い確認</h1>

          {/* Event summary */}
          <div className="card p-5 mb-6 space-y-3">
            <div>
              <p className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">イベント</p>
              <p className="font-display text-base">{ev.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-display text-[var(--color-mute)] mb-0.5">日時</p>
                <p>{ev.datetime_detail.split("\n")[0]}</p>
              </div>
              <div>
                <p className="font-display text-[var(--color-mute)] mb-0.5">会場</p>
                <p>{ev.venue}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-line)]">
              <span className="font-display text-sm">参加区分</span>
              <span className="tag tag-accent text-xs">{genderLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-sm">参加費</span>
              <span className="num text-lg">{fee}</span>
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-5 mb-6">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">保有クーポン（1枚選択可）</p>
            {availableCoupons.length === 0 ? (
              <p className="text-xs text-[var(--color-mute)]">利用可能なクーポンがありません</p>
            ) : (
              <div className="space-y-2">
                {availableCoupons.map(c => {
                  const isSelected = selectedCouponId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCouponId(isSelected ? null : c.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border transition text-left"
                      style={{
                        borderColor: isSelected ? "var(--color-accent)" : "var(--color-line)",
                        background: isSelected ? "rgba(184,152,90,0.08)" : "var(--color-bg)",
                      }}
                    >
                      <div
                        className="flex-none w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: isSelected ? "var(--color-accent-deep)" : "var(--color-line)",
                          background: isSelected ? "var(--color-accent-deep)" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm">{c.title}</div>
                        <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{c.shop} · 期限 {c.expiry}</div>
                      </div>
                      <div className="flex-none font-display text-sm text-[var(--color-accent-deep)]">−¥{c.discount.toLocaleString()}</div>
                    </button>
                  );
                })}
              </div>
            )}
            <p className="mt-3 text-[10px] text-[var(--color-mute)]">※ クーポンは1枚のみ適用可能です</p>
          </div>

          {/* Total */}
          <div className="card p-5 mb-8">
            {appliedDiscount > 0 && (
              <div className="flex items-center justify-between text-xs text-[var(--color-mute)] mb-2">
                <span>小計</span>
                <span className="num">{fee}</span>
              </div>
            )}
            {appliedDiscount > 0 && (
              <div className="flex items-center justify-between text-xs text-[var(--color-accent-deep)] mb-3 pb-3 border-b border-[var(--color-line)]">
                <span>クーポン割引</span>
                <span className="num">−¥{appliedDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-display text-base">合計（税込）</span>
              <span className="num text-2xl">¥{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pb-10">
            <button
              onClick={() => setDone(true)}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              決済する
            </button>
            <button
              onClick={() => router.back()}
              className="w-full btn-outline justify-center"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
