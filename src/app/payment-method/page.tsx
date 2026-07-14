"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentMethodPage() {
  const router = useRouter();
  const [cardNum, setCardNum] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("08 / 28");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("RIKU AOYAMA");
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [done, setDone] = useState(false);

  function formatCardNum(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  }

  function applyCoupon() {
    const valid = ["COMMONS500", "WINE1000", "SUMMER2026"];
    if (valid.includes(coupon.trim().toUpperCase())) {
      setCouponMsg("✓ クーポンを適用しました");
    } else {
      setCouponMsg("このクーポンは無効です");
    }
  }

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">変更が完了しました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            お支払い方法を更新しました。
          </p>
          <button onClick={() => router.back()} className="btn-primary justify-center">マイページへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-16">
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

        <div className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">My Account</p>
            <h1 className="font-display text-2xl">お支払い方法</h1>
          </div>

          {/* Current card */}
          <div className="rounded-2xl p-5 border border-[var(--color-accent)]/30" style={{ background: "linear-gradient(135deg, #141A24, #1e2a38)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-[10px] tracking-widest text-[var(--color-accent-deep)]">現在の支払方法</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 rounded bg-[var(--color-accent)]/80" />
                <div className="w-6 h-4 rounded bg-[var(--color-accent)]/40" />
              </div>
            </div>
            <div className="num text-lg tracking-widest">VISA ···· ···· ···· 4242</div>
            <div className="font-display text-xs text-[var(--color-mute)] mt-1">有効期限 08 / 28</div>
          </div>

          {/* Card form */}
          <div className="card p-5 space-y-4">
            <p className="font-display text-xs text-[var(--color-accent-deep)]">新しいカード情報</p>
            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">カード番号</label>
              <input
                className="input-field"
                placeholder="0000 0000 0000 0000"
                value={cardNum}
                onChange={e => setCardNum(formatCardNum(e.target.value))}
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">有効期限</label>
                <input
                  className="input-field"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">セキュリティコード</label>
                <input
                  className="input-field"
                  placeholder="CVV"
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                />
              </div>
            </div>
            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">カード名義（半角ローマ字）</label>
              <input
                className="input-field"
                placeholder="TARO YAMADA"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">クーポンコード</p>
            <div className="flex gap-2">
              <input
                className="input-field !py-2.5 text-sm flex-1"
                placeholder="コードを入力"
                value={coupon}
                onChange={e => { setCoupon(e.target.value); setCouponMsg(""); }}
              />
              <button
                onClick={applyCoupon}
                disabled={!coupon.trim()}
                className="font-display text-xs px-4 py-2.5 rounded-xl border border-[var(--color-accent)] text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition disabled:opacity-40 whitespace-nowrap"
              >
                適用
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs mt-2 ${couponMsg.startsWith("✓") ? "text-[var(--color-accent-deep)]" : "text-red-400"}`}>{couponMsg}</p>
            )}
          </div>

          {/* Payment summary */}
          <div className="card p-5 space-y-3">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-1">お支払い情報</p>
            <div className="flex items-center justify-between text-sm">
              <span className="font-display text-[var(--color-mute)]">プラン</span>
              <span>年間プラン</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-display text-[var(--color-mute)]">金額</span>
              <span className="num">¥6,000 / 年（¥500/月）</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-display text-[var(--color-mute)]">次回請求日</span>
              <span>2027年7月1日</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-[var(--color-line)] pt-3">
              <span className="font-display text-[var(--color-mute)]">お支払い方法</span>
              <span className="num text-sm">VISA ···· 4242</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pb-4">
            <button
              onClick={() => setDone(true)}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              変更する
            </button>
            <button onClick={() => router.back()} className="w-full btn-outline justify-center">
              戻る
            </button>
            <p className="text-[10px] text-[var(--color-mute)] text-center leading-relaxed">
              ※ カード情報はSSL暗号化通信により安全に送信されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
