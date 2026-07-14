"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const reasons = [
  "イベントに参加できなくなった",
  "費用に見合わないと感じた",
  "期待していたコンテンツと違った",
  "他のコミュニティに移ることにした",
  "一時的に休止したい",
  "その他",
];

export default function WithdrawPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [other, setOther] = useState("");
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="font-display text-4xl mb-4">🕯️</div>
          <h1 className="font-display text-2xl mb-3">退会手続きが完了しました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            ご利用ありがとうございました。<br />
            またいつでも戻ってきてください。
          </p>
          <button onClick={() => router.push("/home")} className="btn-outline justify-center">
            ホームへ
          </button>
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
          {/* Emotional message */}
          <div className="text-center py-6">
            <div className="font-display text-4xl mb-4">🥂</div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">BEFORE YOU GO</p>
            <h1 className="font-display text-2xl mb-4">本当に退会しますか？</h1>
            <p className="text-sm text-[var(--color-mute)] leading-relaxed">
              あなたと過ごした<span className="text-[var(--color-ink)]">8ヶ月</span>、<br />
              <span className="text-[var(--color-ink)]">15回</span>のイベント、<span className="text-[var(--color-ink)]">1,840pt</span>の思い出。<br />
              退会するとポイント・履歴・クーポンは<br />
              すべて失われます。
            </p>
          </div>

          {/* Benefits reminder */}
          <div className="card p-5 border border-[var(--color-accent)]/20">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">退会すると失うもの</p>
            <ul className="space-y-2">
              {["保有ポイント 1,840pt（約¥1,840相当）", "未使用クーポン 3枚", "GOLD会員ランク・特典", "参加済みイベントの記録", "コミュニティへのアクセス"].map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-[var(--color-mute)]">
                  <span className="text-red-400/70">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reason */}
          <div className="card p-5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">退会理由（任意）</p>
            <div className="space-y-2">
              {reasons.map(r => (
                <button
                  key={r}
                  onClick={() => setSelected(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left"
                  style={{
                    borderColor: selected === r ? "var(--color-accent)" : "var(--color-line)",
                    background: selected === r ? "rgba(184,152,90,0.08)" : "transparent",
                  }}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex-none flex items-center justify-center"
                    style={{ borderColor: selected === r ? "var(--color-accent-deep)" : "var(--color-line)" }}>
                    {selected === r && <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent-deep)" }} />}
                  </div>
                  <span className="font-display text-sm">{r}</span>
                </button>
              ))}
            </div>
            {selected === "その他" && (
              <textarea
                className="input-field mt-3 min-h-[80px] resize-none text-sm"
                placeholder="ご意見をお聞かせください…"
                value={other}
                onChange={e => setOther(e.target.value)}
              />
            )}
          </div>

          {/* Confirmation checkbox */}
          <button
            onClick={() => setConfirm(!confirm)}
            className="flex items-start gap-3 w-full text-left"
          >
            <div className="w-5 h-5 rounded border-2 flex-none mt-0.5 flex items-center justify-center transition"
              style={{ borderColor: confirm ? "var(--color-accent-deep)" : "var(--color-line)", background: confirm ? "var(--color-accent)" : "transparent" }}>
              {confirm && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0B0F16" strokeWidth="2" strokeLinecap="round"><polyline points="2 6 5 9 10 3"/></svg>}
            </div>
            <p className="font-display text-xs text-[var(--color-mute)] leading-relaxed">
              退会するとポイント・クーポン・会員ランクがすべて削除され、復元できないことを理解しました。
            </p>
          </button>

          {/* Actions */}
          <div className="space-y-3 pb-8">
            {/* Stay button – prominent */}
            <button
              onClick={() => router.back()}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              退会しない（継続する）
            </button>
            {/* Withdraw button – muted */}
            <button
              onClick={() => { if (confirm) setDone(true); }}
              disabled={!confirm}
              className="w-full py-3.5 rounded-full font-display text-sm border border-red-400/40 text-red-400/70 hover:border-red-400/70 hover:text-red-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              退会する
            </button>
            <p className="text-[10px] text-[var(--color-mute)] text-center">
              ※ 退会後30日間はデータが保持されます（復元可）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
