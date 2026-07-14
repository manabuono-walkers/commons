"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Setting {
  id: string;
  label: string;
  desc: string;
  group: string;
}

const settings: Setting[] = [
  { id: "new_event",    label: "新規イベント",         desc: "新しいイベントが公開されたとき",             group: "イベント" },
  { id: "event_remind", label: "イベントリマインダー",  desc: "参加予定イベントの前日・当日にお知らせ",       group: "イベント" },
  { id: "event_cancel", label: "イベントキャンセル",    desc: "参加予定のイベントがキャンセルになったとき",   group: "イベント" },
  { id: "campaign",     label: "キャンペーン情報",      desc: "割引・特典などのキャンペーン情報",             group: "お知らせ" },
  { id: "system",       label: "システムお知らせ",      desc: "アプリのアップデート・メンテナンス情報",        group: "お知らせ" },
  { id: "store",        label: "提携店舗情報",          desc: "新規提携店舗・特典変更のお知らせ",             group: "お知らせ" },
  { id: "follow",       label: "フォロー通知",          desc: "誰かにフォローされたとき",                    group: "コミュニティ" },
  { id: "reply",        label: "返信通知",              desc: "自分の投稿にコメント・返信があったとき",        group: "コミュニティ" },
  { id: "like",         label: "いいね通知",            desc: "自分の投稿にいいねがあったとき",               group: "コミュニティ" },
  { id: "club_chat",    label: "COMMONS CLUBチャット",   desc: "参加中のCOMMONS CLUBに新しい投稿があったとき", group: "コミュニティ" },
  { id: "push",         label: "プッシュ通知",          desc: "アプリのプッシュ通知を受け取る",               group: "通知方法" },
  { id: "email",        label: "メール通知",            desc: "登録メールアドレスへの通知を受け取る",          group: "通知方法" },
];

const groups = ["通知方法", "イベント", "お知らせ", "コミュニティ"];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-none w-11 h-6 rounded-full transition-colors duration-200"
      style={{ background: on ? "var(--color-accent)" : "var(--color-line)" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ left: on ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(settings.map(s => [s.id, s.id !== "like" && s.id !== "system"]))
  );
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-16">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
              ← 戻る
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            <div className="w-14" />
          </div>
        </header>

        <div className="px-5 pt-8">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">My Account</p>
          <h1 className="font-display text-2xl mb-6">通知設定</h1>

          <div className="space-y-6">
            {groups.map(group => (
              <section key={group}>
                <h2 className="font-display text-xs text-[var(--color-accent-deep)] mb-3 px-1">{group}</h2>
                <div className="card overflow-hidden divide-y divide-[var(--color-line)]">
                  {settings.filter(s => s.group === group).map(s => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm">{s.label}</div>
                        <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{s.desc}</div>
                      </div>
                      <Toggle on={!!enabled[s.id]} onChange={() => toggle(s.id)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 space-y-3 pb-8">
            <button
              onClick={() => setSaved(true)}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              {saved ? "✓ 保存済み" : "設定を保存する"}
            </button>
            <button onClick={() => router.back()} className="w-full btn-outline justify-center">
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
