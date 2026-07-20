"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export default function CreateClubReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", body: "" });
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(key: keyof typeof form, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleImageAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - images.length);
    files.forEach(f => {
      const url = URL.createObjectURL(f);
      setImages(prev => [...prev, url].slice(0, 8));
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex flex-col items-center justify-center px-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-display text-2xl mb-2">レポートを投稿しました</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-8">クラブページの活動レポートに反映されます。</p>
            <button
              onClick={() => router.back()}
              className="font-display text-sm px-8 py-3 rounded-full"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              クラブに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${params.id}`} />
        <div className="px-5 pt-6 pb-4 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">クラブ会</p>
          <h1 className="font-display text-2xl">イベントレポートを作成</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-5">
          <Field label="レポートタイトル *">
            <input
              required
              type="text"
              placeholder="例：ブルゴーニュナイト Vol.13 レポート"
              value={form.title}
              onChange={e => update("title", e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="開催日 *">
            <input
              required
              type="date"
              value={form.date}
              onChange={e => update("date", e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="レポート本文 *">
            <textarea
              required
              rows={6}
              placeholder="イベントの様子や感想を書いてください。参加人数や印象的なエピソードなど。"
              value={form.body}
              onChange={e => update("body", e.target.value)}
              className="input-field resize-none"
            />
          </Field>

          {/* 写真添付 */}
          <div>
            <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">写真を追加（最大8枚）</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center"
                  >×</button>
                </div>
              ))}
              {images.length < 8 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                  style={{ background: "var(--color-bg-soft)", border: "1px dashed var(--color-line)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="font-display text-[9px] text-[var(--color-mute)]">追加</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAttach} />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full font-display text-base"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
          >
            レポートを投稿する
          </button>
        </form>

        <style>{`
          .input-field {
            width: 100%;
            background: var(--color-bg-soft);
            border: 1px solid var(--color-line);
            border-radius: 12px;
            padding: 12px 14px;
            font-size: 14px;
            color: var(--color-ink);
            outline: none;
            transition: border-color 0.2s;
          }
          .input-field:focus {
            border-color: rgba(184,152,90,0.6);
          }
          .input-field::placeholder {
            color: var(--color-mute);
          }
        `}</style>
        <BottomNav />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
