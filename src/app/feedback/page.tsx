"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tags = ["イベント企画", "UI/UX改善", "コミュニティ運営", "提携店舗", "機能要望", "その他"];

export default function FeedbackPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [done, setDone] = useState(false);

  function toggleTag(t: string) {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="text-5xl mb-4">📮</div>
          <h1 className="font-display text-2xl mb-2">ありがとうございます</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            ご意見は運営チームが確認します。<br />
            COMMONSをより良くするために活用します。
          </p>
          <button onClick={() => router.back()} className="btn-primary justify-center">マイページへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-16">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            <div className="w-14" />
          </div>
        </header>

        <div className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">Feedback</p>
            <h1 className="font-display text-2xl">意見箱</h1>
            <p className="font-display text-xs text-[var(--color-mute)] mt-2">匿名でご意見・ご要望をお送りいただけます。返信はできませんが、すべて運営チームが拝読します。</p>
          </div>

          {/* Rating */}
          <div className="card p-5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">COMMONSの満足度</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="text-3xl transition-transform hover:scale-110"
                  style={{ opacity: n <= rating ? 1 : 0.3 }}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="font-display text-xs text-[var(--color-mute)] text-center mt-2">
                {["", "改善が必要です", "もう少しです", "良いと思います", "満足しています", "とても満足しています！"][rating]}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="card p-5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">カテゴリ（複数選択可）</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="font-display text-xs px-3 py-1.5 rounded-full border transition"
                  style={{
                    borderColor: selectedTags.includes(t) ? "var(--color-accent)" : "var(--color-line)",
                    background: selectedTags.includes(t) ? "rgba(184,152,90,0.15)" : "transparent",
                    color: selectedTags.includes(t) ? "var(--color-accent-deep)" : "var(--color-mute)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="card p-5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">ご意見・ご要望</p>
            <textarea
              className="input-field min-h-[140px] resize-none text-sm"
              placeholder="サービスへのご意見・ご要望を自由にお書きください…"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
            <p className="font-display text-[10px] text-[var(--color-mute)] mt-2">※ 匿名での送信です。ご返信はできません。</p>
          </div>

          <div className="space-y-3 pb-8">
            <button
              onClick={() => { if (body.trim()) setDone(true); }}
              disabled={!body.trim()}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              送信する（匿名）
            </button>
            <button onClick={() => router.back()} className="w-full btn-outline justify-center">戻る</button>
          </div>
        </div>
      </div>
    </div>
  );
}
