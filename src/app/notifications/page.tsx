"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const notifications = [
  {
    id: 0,
    badge: "最初に必ず確認",
    title: "COMMONSの使い方・はじめにお読みください",
    body: "①プロフィール設定（名前・アイコン）を行ってください。\n②アカウント認証フォームへのご入力をお願いします（手動認証のためお時間をいただく場合があります）。\n③自己紹介ページで会員の皆様にご挨拶しましょう。テンプレートをご利用ください。\n④各機能・チャンネルの使い方はチャンネル紹介をご確認ください。\n\nご不明な点はお問い合わせよりご連絡ください。",
    time: "必読",
    read: false,
    pinned: true,
  },
  {
    id: 1,
    badge: "キャンペーン",
    title: "【夏割】新規入会で初月会費無料キャンペーン",
    body: "7月末までの新規入会で、初月会費が無料になります。お友達にもぜひシェアをお願いします。",
    time: "2時間前",
    read: false,
  },
  {
    id: 2,
    badge: "新規イベント",
    title: "COMMONS WINE SALON 8月開催が決定",
    body: "ブルゴーニュ地方の名門生産者から選び抜いた6本を、ソムリエの解説とともにお楽しみいただけます。8月2日（土）19:00〜 La Cave 麻布十番。",
    time: "昨日",
    read: false,
  },
  {
    id: 3,
    badge: "お知らせ",
    title: "7月のイベントスケジュールを公開しました",
    body: "先着・抽選あわせて計6件のイベントを公開しました。イベント一覧からご確認ください。",
    time: "2日前",
    read: true,
  },
  {
    id: 4,
    badge: "提携店舗",
    title: "提携店舗 20%OFF週間のお知らせ",
    body: "7月1日〜7月7日の期間、全提携店舗で会員証提示により飲食代金が20%OFFになります。お得なこの機会をぜひご活用ください。",
    time: "3日前",
    read: true,
  },
  {
    id: 5,
    badge: "システム",
    title: "アプリ v2.1.0 リリースのお知らせ",
    body: "COMMONS CLUBチャット・意見箱機能が追加されました。新機能についてのご意見はぜひ意見箱からお寄せください。",
    time: "5日前",
    read: true,
  },
];

const badgeColors: Record<string, string> = {
  "最初に必ず確認": "tag-accent",
  "キャンペーン": "tag-accent",
  "新規イベント": "tag-ink",
  "お知らせ": "",
  "提携店舗": "",
  "システム": "",
};

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/home" />

        <div className="px-5 pt-6 pb-3">
          <h1 className="font-display text-2xl">通知</h1>
          {unread > 0 && (
            <p className="font-display text-xs text-[var(--color-mute)] mt-1">未読 {unread}件</p>
          )}
        </div>

        <div className="px-5 space-y-2">
          {notifications.map((n) => {
            const isOpen = expanded === n.id;
            return (
              <div
                key={n.id}
                className={`card relative transition-all cursor-pointer ${!n.read ? "border-[var(--color-accent)]/40" : ""}`}
                onClick={() => setExpanded(isOpen ? null : n.id)}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute top-4 right-10 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                )}

                {/* Header row — always visible */}
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`tag text-[10px] ${badgeColors[n.badge] || ""}`}>{n.badge}</span>
                      <span className="font-display text-[10px] text-[var(--color-mute)]">{n.time}</span>
                    </div>
                    <h3 className="font-display text-sm leading-snug">{n.title}</h3>
                  </div>
                  {/* Chevron */}
                  <span
                    className="flex-none mt-0.5 text-[var(--color-mute)] transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-[var(--color-line)] pt-3">
                    <p className="text-xs text-[var(--color-mute)] leading-relaxed">{n.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
