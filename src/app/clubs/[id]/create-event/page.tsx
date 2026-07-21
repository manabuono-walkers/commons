"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export default function CreateClubEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    fee: "",
    capacity: "",
    desc: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(key: keyof typeof form, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
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
            <h2 className="font-display text-2xl mb-2">イベントを作成しました</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-8">モデレーターが確認後、メンバーに公開されます。</p>
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
          <h1 className="font-display text-2xl">イベントを作成</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-5">

          {/* Image upload */}
          <Field label="イベント画像">
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-line)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button"
                onClick={() => fileRef.current?.click()}
                disabled={images.length >= 4}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed transition disabled:opacity-30"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-deep)", background: "rgba(184,152,90,0.06)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="font-display text-sm">画像を追加（最大4枚）</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
                const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length);
                files.forEach(f => { const url = URL.createObjectURL(f); setImages(prev => [...prev, url].slice(0, 4)); });
              }} />
            </div>
          </Field>

          <Field label="イベント名 *">
            <input
              required
              type="text"
              placeholder="例：シャンパーニュ特集 Vol.4"
              value={form.title}
              onChange={e => update("title", e.target.value)}
              className="input-field"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="開催日 *">
              <input
                required
                type="date"
                value={form.date}
                onChange={e => update("date", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="開始時間 *">
              <input
                required
                type="time"
                value={form.time}
                onChange={e => update("time", e.target.value)}
                className="input-field"
              />
            </Field>
          </div>

          <Field label="会場 *">
            <input
              required
              type="text"
              placeholder="例：La Cave 麻布十番"
              value={form.venue}
              onChange={e => update("venue", e.target.value)}
              className="input-field"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="参加費">
              <input
                type="text"
                placeholder="例：¥5,000"
                value={form.fee}
                onChange={e => update("fee", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="定員">
              <input
                type="number"
                placeholder="例：12"
                value={form.capacity}
                onChange={e => update("capacity", e.target.value)}
                className="input-field"
              />
            </Field>
          </div>

          <Field label="詳細・備考">
            <textarea
              rows={4}
              placeholder="イベントの内容や参加条件などを記入してください。"
              value={form.desc}
              onChange={e => update("desc", e.target.value)}
              className="input-field resize-none"
            />
          </Field>

          <button
            type="submit"
            className="w-full py-4 rounded-full font-display text-base"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
          >
            イベントを作成する
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
