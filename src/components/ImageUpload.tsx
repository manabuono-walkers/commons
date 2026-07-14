"use client";
import { useState, useRef } from "react";

interface Props {
  label?: string;
  hint?: string;
}

export default function ImageUpload({ label = "サムネイル画像", hint = "推奨: 16:9 / JPG・PNG / 最大5MB" }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-[var(--color-accent)]/40">
          <img src={preview} alt="preview" className="w-full object-cover" style={{ maxHeight: 200 }} />
          <button
            onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80 transition"
          >✕</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer transition flex flex-col items-center justify-center py-8 gap-2 ${dragging ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5" : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/3"}`}
        >
          <div className="text-2xl opacity-40">🖼</div>
          <div className="font-display text-sm text-[var(--color-mute)] text-center">
            ここに画像をドラッグ＆ドロップ<br />
            <span className="text-[var(--color-accent-deep)]">またはクリックしてファイルを選択</span>
          </div>
          <div className="font-display text-[10px] text-[var(--color-mute)]">{hint}</div>
        </div>
      )}
    </div>
  );
}
