"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

type EventForm = {
  title: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  fee: string;
  capacity: string;
  desc: string;
};

const EMPTY_FORM: EventForm = {
  title: "", date: "", time: "", endTime: "", venue: "", fee: "", capacity: "", desc: "",
};

// 編集時のプリフィル用データ（※内容は仮のモックデータ）
const EDIT_DATA: Record<string, Record<string, EventForm>> = {
  wine: {
    "4": { title: "気軽な交流会", date: "2026-07-25", time: "18:00", endTime: "21:00", venue: "新宿", fee: "男性 6,000円 / 女性 4,000円", capacity: "10", desc: "気軽に話せる場を作りたくて、少人数の交流会を企画しました。形式ばった会ではなく、落ち着いて会話ができる時間にしたいと思っています。仕事以外のつながりを作りたい方や、新しい人と話してみたい方はぜひ。" },
    "1": { title: "シャンパーニュ特集 Vol.3", date: "2026-07-12", time: "19:00", endTime: "21:00", venue: "La Cave 麻布十番", fee: "¥8,500", capacity: "12", desc: "銘醸シャンパーニュをヴィンテージ違いで飲み比べ。醸造家による特別解説付き。ドレスコードはスマートカジュアルでお越しください。" },
    "2": { title: "ボルドー格付け比較会", date: "2026-08-02", time: "18:30", endTime: "21:00", venue: "Atelier du Vin 銀座", fee: "¥11,000", capacity: "10", desc: "1〜5級シャトーを縦断してテイスティング。格付けと価格の関係を体感できる贅沢な一夜。専門家の解説付き。" },
    "3": { title: "秋のブルゴーニュナイト Vol.13", date: "2026-09-06", time: "19:00", endTime: "21:00", venue: "La Cave 麻布十番", fee: "¥9,500", capacity: "12", desc: "ブルゴーニュの赤・白をヴィンテージ違いで楽しむ人気シリーズ第13弾。ソムリエによる詳細解説もあります。" },
  },
  coffee: {
    "1": { title: "Sunday Coffee Cupping #8", date: "2026-07-05", time: "11:00", endTime: "13:00", venue: "COFFEE LAB 渋谷", fee: "¥3,200", capacity: "8", desc: "シングルオリジン3種をスペシャルティコーヒー専門家とカッピング。香りと味わいの違いを丁寧に解説します。初心者歓迎。" },
  },
  travel: {
    "1": { title: "金沢日帰りグルメ旅", date: "2026-08-23", time: "07:30", endTime: "19:30", venue: "東京駅（新幹線集合）", fee: "¥15,000", capacity: "10", desc: "北陸新幹線で金沢へ日帰り旅。近江町市場・ひがし茶屋街・21世紀美術館を巡り、夜は地元料理でディナー。現地解散可。" },
  },
};

export default function CreateClubEventPage() {
  return (
    <Suspense fallback={null}>
      <CreateEventForm />
    </Suspense>
  );
}

function CreateEventForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const clubId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const editId = searchParams.get("edit") ?? "";
  const editData = editId ? (EDIT_DATA[clubId] ?? {})[editId] : undefined;
  const isEdit = !!editData;

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<EventForm>(editData ?? EMPTY_FORM);

  function update(key: keyof EventForm, val: string) {
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
            <h2 className="font-display text-2xl mb-2">{isEdit ? "イベントを更新しました" : "イベントを作成しました"}</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-8">
              {isEdit ? "変更内容がメンバーに反映されます。" : "モデレーターが確認後、メンバーに公開されます。"}
            </p>
            <button
              onClick={() => router.push(`/clubs/${clubId}`)}
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
        <AppHeader backHref={`/clubs/${clubId}`} />
        <div className="px-5 pt-6 pb-4 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">クラブ会</p>
          <h1 className="font-display text-2xl">{isEdit ? "イベントを編集" : "イベントを作成"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-5">

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

          <Field label="開催日 *">
            <input
              required
              type="date"
              value={form.date}
              onChange={e => update("date", e.target.value)}
              className="input-field"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="開始時間 *">
              <input
                required
                type="time"
                value={form.time}
                onChange={e => update("time", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="終了時間 *">
              <input
                required
                type="time"
                value={form.endTime}
                onChange={e => update("endTime", e.target.value)}
                className="input-field"
              />
            </Field>
          </div>

          <Field label="場所 *">
            <input
              required
              type="text"
              placeholder="例：La Cave 麻布十番 / 新宿"
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
            {isEdit ? "変更を保存する" : "イベントを作成する"}
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
