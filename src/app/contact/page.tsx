"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function ContactPage() {
  const router = useRouter();
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
          <h1 className="font-display text-xl font-semibold mb-2">お問い合わせを受け付けました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">内容を確認の上、2営業日以内にご連絡いたします。</p>
          <button onClick={() => router.back()} className="btn-primary justify-center">マイページへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>
        <main className="px-5 pt-6 pb-10 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold">お問い合わせ</h1>
            <p className="mt-2 text-sm text-[var(--color-mute)] leading-relaxed">ご質問・お困りのことがあればお気軽にご連絡ください。通常2営業日以内にご返答いたします。</p>
          </div>
          <section className="card p-4 space-y-3">
            <div className="font-display text-xs font-semibold text-[var(--color-accent-deep)] mb-1">よくある質問</div>
            {[
              { q: "イベントをキャンセルしたい", a: "イベント詳細ページよりキャンセルが可能です。開催3日前まではキャンセル料なし。" },
              { q: "支払い方法を変更したい", a: "マイページ › 各種設定 › 契約プランより変更いただけます。" },
              { q: "退会したい", a: "マイページ › 各種設定 › 退会するよりお手続きください。" },
            ].map((faq, i) => (
              <details key={i} className="group border-t border-[var(--color-line)] first:border-0 pt-3 first:pt-0">
                <summary className="font-display text-sm cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none"><polyline points="6 9 12 15 18 9"/></svg>
                </summary>
                <p className="text-sm text-[var(--color-mute)] leading-relaxed pt-2">{faq.a}</p>
              </details>
            ))}
          </section>
          <section className="space-y-4">
            <div>
              <div className="font-display text-xs text-[var(--color-mute)] mb-2">お問い合わせ内容 *</div>
              <textarea className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl p-3 text-sm text-[var(--color-ink)] outline-none resize-none focus:border-[var(--color-accent)] transition"
                rows={5} placeholder="詳細をご記入ください" value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <button onClick={() => body.trim() && setSent(true)} disabled={!body.trim()}
              className="w-full py-4 rounded-full font-display text-sm transition hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}>
              送信する
            </button>
          </section>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
