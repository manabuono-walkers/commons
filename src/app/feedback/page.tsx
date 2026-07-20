"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const categories = [
  { key: "ui", label: "画面の使いやすさ", desc: "ナビゲーション・デザイン・操作感など" },
  { key: "event", label: "イベント・企画について", desc: "イベントの内容・頻度・申込フローなど" },
  { key: "club", label: "クラブ・コミュニティ", desc: "クラブ機能・チャット・メンバーとの交流など" },
  { key: "other", label: "その他ご意見・ご要望", desc: "上記に当てはまらないご意見" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const [cat, setCat] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold mb-2">ご意見を受け付けました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            いただいたご意見は今後の改善に活用させていただきます。ありがとうございます。
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => { setSent(false); setCat(""); setBody(""); }} className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition">別のご意見を送る</button>
            <button onClick={() => router.back()} className="w-full py-3.5 rounded-full font-display text-sm text-center transition hover:opacity-90" style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}>各種設定へ戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 pb-10 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold">意見箱</h1>
            <p className="mt-2 text-sm text-[var(--color-mute)] leading-relaxed">
              アプリをより良くするためのご意見をお聞かせください。いただいたご意見は今後の改善に役立てさせていただきます。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="font-display text-xs text-[var(--color-mute)] mb-3">カテゴリを選んでください</div>
              <div className="space-y-2">
                {categories.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCat(c.key)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition"
                    style={{
                      borderColor: cat === c.key ? "var(--color-accent)" : "var(--color-line)",
                      background: cat === c.key ? "rgba(184,152,90,0.06)" : "var(--color-bg-soft)",
                    }}
                  >
                    <div
                      className="flex-none w-4 h-4 rounded-full border flex items-center justify-center transition"
                      style={{ borderColor: cat === c.key ? "var(--color-accent-deep)" : "var(--color-line)" }}
                    >
                      {cat === c.key && <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent-deep)" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm">{c.label}</div>
                      <div className="font-display text-xs text-[var(--color-mute)] mt-0.5">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-display text-xs text-[var(--color-mute)] mb-2">ご意見・ご要望</div>
              <textarea
                className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl p-4 text-sm text-[var(--color-ink)] outline-none resize-none leading-relaxed"
                style={{ transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--color-line)"}
                rows={5}
                placeholder="ご自由にお書きください"
                value={body}
                onChange={e => setBody(e.target.value)}
              />
            </div>

            <button
              onClick={() => (cat && body.trim()) && setSent(true)}
              disabled={!cat || !body.trim()}
              className="w-full py-4 rounded-full font-display text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              送信する
            </button>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
