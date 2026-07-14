"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function ProfileEditPage() {
  const [name, setName] = useState("青山 陸");
  const [nameKana, setNameKana] = useState("アオヤマ リク");
  const [displayName, setDisplayName] = useState("陸");
  const [avatar, setAvatar] = useState("/images/icon.png");
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  }

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex flex-col items-center justify-center gap-5 px-8 text-center">
          <div className="text-5xl">✓</div>
          <div className="font-display text-2xl">プロフィールを更新しました</div>
          <Link href="/mypage" className="btn-primary px-8 py-3 rounded-full font-display text-sm mt-4">マイページへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/mypage" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 space-y-8">
          <h1 className="font-display text-2xl">プロフィール編集</h1>

          {/* Avatar */}
          <section className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt="アバター"
              className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-accent)] cursor-pointer"
              onClick={() => fileRef.current?.click()}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="font-display text-xs text-[var(--color-accent-deep)] border border-[var(--color-accent)]/40 rounded-full px-5 py-2 hover:bg-[var(--color-accent)]/10 transition"
            >
              写真を変更
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </section>

          {/* Fields */}
          <section className="space-y-5">
            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">氏名</label>
              <input
                className="input-field w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="氏名"
              />
            </div>
            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">氏名（フリガナ）</label>
              <input
                className="input-field w-full"
                value={nameKana}
                onChange={e => setNameKana(e.target.value)}
                placeholder="フリガナ"
              />
            </div>
            <div>
              <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">表示名</label>
              <input
                className="input-field w-full"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="表示名（ニックネーム等）"
              />
            </div>
          </section>

          <button
            onClick={() => setDone(true)}
            className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
          >
            保存する
          </button>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
