"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function ClubApplyPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    desc: "",
    reason: "",
    contact: "",
  });
  const [done, setDone] = useState(false);

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const valid = form.name.trim() && form.category && form.desc.trim() && form.reason.trim();

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">申請を受け付けました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            内容を確認のうえ、3営業日以内にご連絡いたします。
          </p>
          <Link href="/clubs" className="btn-primary justify-center">クラブ一覧へ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/clubs" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 space-y-8 pb-10">
          <div>
            <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">COMMONS CLUB</div>
            <h1 className="font-display text-2xl">クラブ申請</h1>
            <p className="mt-2 text-xs text-[var(--color-mute)] leading-relaxed">
              新しいCOMMONS CLUBを開設したい方はこちらからご申請ください。内容確認後、3営業日以内にご連絡いたします。
            </p>
          </div>

          <section className="space-y-5">
            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">クラブ名 <span className="text-[var(--color-mute)]">*</span></label>
              <input
                className="input-field w-full"
                placeholder="例：サウナクラブ、映画クラブ"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">カテゴリ <span className="text-[var(--color-mute)]">*</span></label>
              <select
                className="input-field w-full"
                value={form.category}
                onChange={e => handleChange("category", e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="グルメ">グルメ</option>
                <option value="アート">アート</option>
                <option value="ライフ">ライフ</option>
                <option value="スポーツ">スポーツ</option>
                <option value="エンタメ">エンタメ</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">クラブの説明 <span className="text-[var(--color-mute)]">*</span></label>
              <textarea
                className="input-field w-full resize-none"
                rows={3}
                placeholder="どんな活動をするクラブか、簡単に説明してください"
                value={form.desc}
                onChange={e => handleChange("desc", e.target.value)}
              />
            </div>

            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">開設したい理由 <span className="text-[var(--color-mute)]">*</span></label>
              <textarea
                className="input-field w-full resize-none"
                rows={3}
                placeholder="開設を希望する理由や、どんな会にしたいかをお聞かせください"
                value={form.reason}
                onChange={e => handleChange("reason", e.target.value)}
              />
            </div>

            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">連絡先（任意）</label>
              <input
                className="input-field w-full"
                placeholder="メールアドレスまたはSNS"
                value={form.contact}
                onChange={e => handleChange("contact", e.target.value)}
              />
            </div>
          </section>

          <button
            onClick={() => setDone(true)}
            disabled={!valid}
            className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
          >
            申請する
          </button>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
