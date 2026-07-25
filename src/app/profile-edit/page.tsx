"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// 生年月日から年齢を算出（ユーザーパラメータとして保持する想定）
function calcAge(birth: string): number | null {
  if (!birth) return null;
  const b = new Date(birth);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

const GENDERS = ["男性", "女性", "その他"] as const;

const JOBS = [
  "会社員（一般職）",
  "会社員（総合職）",
  "公務員",
  "士業",
  "医療従事者",
  "経営者・会社役員",
  "自営業",
  "個人事業主・フリーランス",
  "パート・アルバイト",
  "その他",
];

// ※ 初期値は仮のモックデータ
const INITIAL = {
  photo: "/images/icon.png",
  realName: "青山 陸",
  displayName: "りく",
  gender: "男性",
  birthdate: "2000-08-15",
  residence: "東京都",
  hometown: "神奈川県",
  job: "会社員（総合職）",
  hobby: "ワイン、旅行、写真",
  mbti: "ENFP",
  loveType: "ロマンチスト",
  sns: "https://instagram.com/aoyama_r",
  bio: "ワインと旅が好きです。COMMONS CLUBで色々なジャンルのコミュニティを楽しんでいます。仕事以外のつながりを大切にしたくて入会しました。",
  gallery: ["/images/wine.png", "/images/bar.png", "/images/cafe.png", "/images/gallery.png"] as string[],
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const age = calcAge(form.birthdate);

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 pb-6 space-y-6">
          <h1 className="font-display text-xl font-semibold">プロフィールを編集</h1>

          {/* プレビューボタン */}
          <Link href="/profile"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--color-accent)]/40 font-display text-sm text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/6 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            他のユーザーからの見え方を確認する
          </Link>

          {/* 写真（アイコン） */}
          <Field label="写真（アイコン）" required>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo} alt="アイコン" className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-line)]" />
                <button type="button" onClick={() => photoRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent)", border: "2px solid var(--color-bg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
              </div>
              <div className="font-display text-xs text-[var(--color-mute)]">タップして写真を変更</div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) update("photo", URL.createObjectURL(f));
              }} />
            </div>
          </Field>

          {/* 本名 */}
          <Field label="本名" required note="他のユーザーには表示されません">
            <TextInput value={form.realName} onChange={v => update("realName", v)} placeholder="例：青山 陸" />
          </Field>

          {/* 表示名 */}
          <Field label="表示名" required>
            <TextInput value={form.displayName} onChange={v => update("displayName", v)} placeholder="例：りく" />
          </Field>

          {/* 性別 */}
          <Field label="性別" required>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map(g => (
                <button key={g} type="button" onClick={() => update("gender", g)}
                  className="py-3 rounded-xl font-display text-sm transition border"
                  style={form.gender === g
                    ? { background: "rgba(184,152,90,0.15)", borderColor: "var(--color-accent)", color: "var(--color-accent-deep)" }
                    : { background: "var(--color-bg-soft)", borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
                  {g}
                </button>
              ))}
            </div>
          </Field>

          {/* 生年月日 */}
          <Field label="生年月日" required note={age !== null ? `年齢：${age}歳（自動算出）` : "yyyy/mm/dd"}>
            <input type="date" value={form.birthdate} onChange={e => update("birthdate", e.target.value)}
              className="input-field" />
          </Field>

          {/* 居住地 */}
          <Field label="居住地" required>
            <TextInput value={form.residence} onChange={v => update("residence", v)} placeholder="例：東京都" />
          </Field>

          {/* 出身地 */}
          <Field label="出身地">
            <TextInput value={form.hometown} onChange={v => update("hometown", v)} placeholder="例：神奈川県" />
          </Field>

          {/* 職業 */}
          <Field label="職業" required>
            <select value={form.job} onChange={e => update("job", e.target.value)} className="input-field">
              <option value="">選択してください</option>
              {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </Field>

          {/* 趣味・好きなこと */}
          <Field label="趣味・好きなこと">
            <TextInput value={form.hobby} onChange={v => update("hobby", v)} placeholder="例：ワイン、旅行、写真" />
          </Field>

          {/* MBTI */}
          <Field label="MBTI">
            <TextInput value={form.mbti} onChange={v => update("mbti", v)} placeholder="例：ENFP" />
          </Field>

          {/* ラブタイプ */}
          <Field label="ラブタイプ">
            <TextInput value={form.loveType} onChange={v => update("loveType", v)} placeholder="例：ロマンチスト" />
          </Field>

          {/* SNSリンク */}
          <Field label="SNSリンク" note="1つのみ・URLを入力">
            <input type="url" value={form.sns} onChange={e => update("sns", e.target.value)} placeholder="https://..."
              className="input-field" />
          </Field>

          {/* 自己紹介 */}
          <Field label="自己紹介" required>
            <textarea rows={5} value={form.bio} onChange={e => update("bio", e.target.value)}
              placeholder="自己紹介を入力（改行できます）" className="input-field resize-none leading-relaxed" />
            <div className="text-right font-display text-xs text-[var(--color-mute)] mt-1">{form.bio.length} / 400</div>
          </Field>

          {/* ギャラリー */}
          <Field label="ギャラリー" note="お気に入りの写真を9枚まで掲載できます">
            <div className="grid grid-cols-3 gap-2">
              {form.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--color-line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update("gallery", form.gallery.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">×</button>
                </div>
              ))}
              {form.gallery.length < 9 && (
                <button type="button" onClick={() => galleryRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 transition"
                  style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-deep)", background: "rgba(184,152,90,0.06)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span className="font-display text-[10px]">{form.gallery.length}/9</span>
                </button>
              )}
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
              const files = Array.from(e.target.files ?? []).slice(0, 9 - form.gallery.length);
              const urls = files.map(f => URL.createObjectURL(f));
              update("gallery", [...form.gallery, ...urls].slice(0, 9));
            }} />
          </Field>
        </main>

        {/* 固定保存ボタン */}
        <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] pointer-events-auto px-5 py-4 bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)]">
            <button onClick={save}
              className="w-full py-3.5 rounded-full font-display text-sm transition hover:opacity-90 active:scale-95"
              style={{ background: saved ? "rgba(184,152,90,0.2)" : "linear-gradient(135deg, #CBAE74, #B8985A)", color: saved ? "var(--color-accent-deep)" : "#0B0F16" }}>
              {saved ? "保存しました ✓" : "変更を保存する"}
            </button>
          </div>
        </div>

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
          .input-field:focus { border-color: rgba(184,152,90,0.6); }
          .input-field::placeholder { color: var(--color-mute); }
        `}</style>

        <BottomNav />
      </div>
    </div>
  );
}

function Field({ label, required = false, note, children }: { label: string; required?: boolean; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] block mb-2">
        {label}
        {required && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)" }}>必須</span>}
      </label>
      {children}
      {note && <div className="font-display text-[11px] text-[var(--color-mute)] mt-1.5">{note}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
