"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "青山 陸",
    handle: "@aoyama_r",
    bio: "ワインと旅が好きです。COMMONS CLUBで色々なジャンルのコミュニティを楽しんでいます。",
    job: "マーケター",
    location: "東京",
  });
  const [saved, setSaved] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    setTimeout(() => router.push("/mypage"), 800);
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-32">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 pb-6 space-y-6">
          <h1 className="font-display text-xl font-semibold">プロフィールを編集</h1>

          {/* プロフィールを確認ボタン */}
          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--color-accent)]/40 font-display text-sm text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/6 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            他のユーザーからの見え方を確認する
          </Link>

          {/* アバター */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img src="/images/icon.png" alt="アバター" className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-line)]" />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent)", border: "2px solid var(--color-bg)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>
            <div className="font-display text-xs text-[var(--color-mute)]">タップして写真を変更</div>
          </div>

          {/* フォーム */}
          <div className="space-y-5">
            <Field label="名前" value={form.name} onChange={v => update("name", v)} placeholder="名前を入力" />
            <Field label="表示名" value={form.handle} onChange={v => update("handle", v)} placeholder="@username" />
            <div>
              <label className="font-display text-xs text-[var(--color-mute)] block mb-2">自己紹介</label>
              <textarea
                className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl p-3 text-sm text-[var(--color-ink)] outline-none resize-none leading-relaxed"
                style={{ transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--color-line)"}
                rows={4}
                placeholder="自己紹介を入力"
                value={form.bio}
                onChange={e => update("bio", e.target.value)}
              />
              <div className="text-right font-display text-xs text-[var(--color-mute)] mt-1">{form.bio.length} / 200</div>
            </div>
            <Field label="職業・肩書き（任意）" value={form.job} onChange={v => update("job", v)} placeholder="例：デザイナー、会社員" />
            <Field label="居住地（任意）" value={form.location} onChange={v => update("location", v)} placeholder="例：東京、大阪" />
          </div>
        </main>

        {/* 固定保存ボタン */}
        <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] pointer-events-auto px-5 py-4 bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)]">
            <button
              onClick={save}
              className="w-full py-3.5 rounded-full font-display text-sm transition hover:opacity-90 active:scale-95"
              style={{ background: saved ? "rgba(184,152,90,0.2)" : "linear-gradient(135deg, #CBAE74, #B8985A)", color: saved ? "var(--color-accent-deep)" : "#0B0F16" }}
            >
              {saved ? "保存しました ✓" : "変更を保存する"}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] block mb-2">{label}</label>
      <input
        className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
        style={{ transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
        onBlur={e => e.target.style.borderColor = "var(--color-line)"}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
