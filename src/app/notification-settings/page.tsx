"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Section = {
  heading: string;
  items: { key: string; label: string; desc: string }[];
};

const sections: Section[] = [
  {
    heading: "通知方法",
    items: [
      { key: "push",  label: "プッシュ通知",   desc: "アプリのプッシュ通知を受け取る" },
      { key: "email", label: "メール通知",      desc: "登録メールアドレスへの通知を受け取る" },
    ],
  },
  {
    heading: "イベント",
    items: [
      { key: "ev_new",      label: "新規イベント",          desc: "新しいイベントが公開されたとき" },
      { key: "ev_remind",   label: "イベントリマインダー",   desc: "参加予定イベントの前日・当日にお知らせ" },
      { key: "ev_cancel",   label: "イベントキャンセル",     desc: "参加予定のイベントがキャンセルになったとき" },
    ],
  },
  {
    heading: "お知らせ",
    items: [
      { key: "campaign", label: "キャンペーン情報",    desc: "割引・特典などのキャンペーン情報" },
      { key: "system",   label: "システムお知らせ",    desc: "アプリのアップデート・メンテナンス情報" },
      { key: "store",    label: "提携店舗情報",        desc: "新規提携店舗・特典変更のお知らせ" },
    ],
  },
  {
    heading: "コミュニティ",
    items: [
      { key: "follow",  label: "フォロー通知",            desc: "誰かにフォローされたとき" },
      { key: "reply",   label: "返信通知",                desc: "自分の投稿にコメント・返信があったとき" },
      { key: "like",    label: "いいね通知",              desc: "自分の投稿にいいねがあったとき" },
      { key: "club",    label: "COMMONS CLUBチャット",    desc: "参加中のCOMMONS CLUBに新しい投稿があったとき" },
    ],
  },
];

const defaults: Record<string, boolean> = {
  push: true, email: true,
  ev_new: true, ev_remind: true, ev_cancel: true,
  campaign: false, system: true, store: false,
  follow: true, reply: true, like: false, club: true,
};

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-36">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 pb-6 space-y-6">
          <h1 className="font-display text-xl font-semibold">通知設定</h1>

          {sections.map(sec => (
            <section key={sec.heading}>
              <div className="font-display text-xs text-[var(--color-mute)] mb-2 px-1">{sec.heading}</div>
              <div className="card divide-y divide-[var(--color-line)]">
                {sec.items.map(item => (
                  <div key={item.key} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm">{item.label}</div>
                      <div className="font-display text-xs text-[var(--color-mute)] mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => toggle(item.key)}
                      className="flex-none relative w-11 h-6 rounded-full transition-all duration-300"
                      style={{ background: settings[item.key] ? "var(--color-accent)" : "var(--color-line)" }}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                        style={{ left: settings[item.key] ? "calc(100% - 20px)" : "4px" }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* 固定フッターボタン */}
        <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] pointer-events-auto px-5 py-4 bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)] space-y-3">
            <button
              onClick={save}
              className="w-full py-3.5 rounded-full font-display text-sm transition hover:opacity-90 active:scale-95"
              style={{ background: saved ? "rgba(184,152,90,0.2)" : "linear-gradient(135deg, #CBAE74, #B8985A)", color: saved ? "var(--color-accent-deep)" : "#0B0F16" }}
            >
              {saved ? "保存しました ✓" : "設定を保存する"}
            </button>
            <button onClick={() => router.back()} className="block w-full py-3 rounded-full font-display text-sm text-center text-[var(--color-mute)] border border-[var(--color-line)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition">
              戻る
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
