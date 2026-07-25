"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

// ============ Types ============
interface ChatMsg {
  id: number;
  name: string;
  avatar: string;
  body: string;
  time: string;
  fromMe?: boolean;
  isOrganizer?: boolean;
}

interface EventChat {
  title: string;
  emoji: string;
  participants: number;
  state: string;
  organizer: { name: string; age: number; job: string; avatar: string };
  info: { date: string; place: string; capacity: string; fee: string };
  announcement: string; // 主催者の告知（最初のメッセージ）
  messages: ChatMsg[];
}

const MY_NAME = "青山 陸";
const MY_AVATAR = "/images/icon.png";

// ============ Chat Data（※内容は仮のモックデータ） ============
const CHAT_DATA: Record<string, Record<string, EventChat>> = {
  wine: {
    "4": {
      title: "気軽な交流会", emoji: "🥂", participants: 6, state: "受付中",
      organizer: { name: "ふみや", age: 25, job: "看護師", avatar: "ふ" },
      info: {
        date: "7月25日（土）18:00〜",
        place: "新宿（詳細は参加者に共有）",
        capacity: "10名程度（少人数でゆっくり話せる規模）",
        fee: "男性 6,000円 / 女性 4,000円（飲食代込み）",
      },
      announcement:
        "気軽に話せる場を作りたくて、少人数の交流会を企画しました。\n形式ばった会ではなく、落ち着いて会話ができる時間にしたいと思っています。\n\n参加者は20代〜30代の社会人中心を想定しています。\n男女比は5:5程度になるよう調整予定です。\n\n1人参加の方も多くなる想定なので、初めてでも入りやすい雰囲気にします。\n\n仕事以外のつながりを作りたい方や、新しい人と話してみたい方はぜひ。\n\n無理に盛り上げる場ではなく、自然に会話ができる時間にしたいと思っています。\n\n参加希望の方やご質問がある場合はお気軽にコメントください！",
      messages: [
        { id: 1, name: "田中 康介", avatar: "/images/tanaka.png", body: "参加したいです！", time: "30分前" },
        { id: 2, name: "ふみや", avatar: "ふ", body: "ありがとうございます！お待ちしてます😊", time: "28分前", isOrganizer: true },
        { id: 3, name: "山本 彩花", avatar: "/images/yamamoto.png", body: "ちょっと遅れるかもですが参加可能ですか？", time: "20分前" },
        { id: 4, name: "ふみや", avatar: "ふ", body: "全然大丈夫です！18:30くらいまでに来ていただければ🙆", time: "18分前", isOrganizer: true },
        { id: 5, name: "伊藤 健", avatar: "/images/ito.png", body: "1人参加でも浮かないか心配ですが大丈夫でしょうか？", time: "10分前" },
        { id: 6, name: "ふみや", avatar: "ふ", body: "もちろんです！1人参加の方が多いので気軽にどうぞ😊", time: "5分前", isOrganizer: true },
      ],
    },
    "1": {
      title: "シャンパーニュ特集 Vol.3", emoji: "🍾", participants: 4, state: "受付中",
      organizer: { name: "田中 康介", age: 38, job: "不動産会社 代表", avatar: "/images/tanaka.png" },
      info: { date: "7月12日（日）19:00〜", place: "La Cave 麻布十番", capacity: "12名", fee: "¥8,500" },
      announcement:
        "銘醸シャンパーニュをヴィンテージ違いで飲み比べます。醸造家による特別解説付き。\n\nドレスコードはスマートカジュアルでお越しください。ご質問はお気軽にどうぞ！",
      messages: [
        { id: 1, name: "山本 彩花", avatar: "/images/yamamoto.png", body: "参加します！楽しみにしています🥂", time: "3時間前" },
        { id: 2, name: "田中 康介", avatar: "/images/tanaka.png", body: "当日は醸造家の方も来られます🍾 ぜひ質問してみてください", time: "2時間前", isOrganizer: true },
      ],
    },
    "2": {
      title: "ボルドー格付け比較会", emoji: "🍷", participants: 10, state: "受付中",
      organizer: { name: "山本 彩花", age: 34, job: "フリーランスデザイナー", avatar: "/images/yamamoto.png" },
      info: { date: "8月2日（日）18:30〜", place: "Atelier du Vin 銀座", capacity: "10名", fee: "¥11,000" },
      announcement:
        "1〜5級シャトーを縦断してテイスティングします。格付けと価格の関係を体感できる贅沢な一夜。専門家の解説付きです。",
      messages: [
        { id: 1, name: "伊藤 健", avatar: "/images/ito.png", body: "滑り込みで参加できました！", time: "昨日" },
        { id: 2, name: "山本 彩花", avatar: "/images/yamamoto.png", body: "満席になりました！ありがとうございます🙌", time: "昨日", isOrganizer: true },
      ],
    },
    "3": {
      title: "秋のブルゴーニュナイト Vol.13", emoji: "🍇", participants: 12, state: "申込済み",
      organizer: { name: "田中 康介", age: 38, job: "不動産会社 代表", avatar: "/images/tanaka.png" },
      info: { date: "9月6日（日）19:00〜", place: "La Cave 麻布十番", capacity: "12名", fee: "¥9,500" },
      announcement:
        "ブルゴーニュの赤・白をヴィンテージ違いで楽しむ人気シリーズ第13弾。ソムリエによる詳細解説もあります。",
      messages: [
        { id: 1, name: "青山 陸", avatar: "/images/icon.png", body: "申し込みました！今から楽しみです", time: "3日前", fromMe: true },
        { id: 2, name: "田中 康介", avatar: "/images/tanaka.png", body: "詳細はまた共有しますね🍇", time: "3日前", isOrganizer: true },
      ],
    },
  },
  coffee: {
    "1": {
      title: "Sunday Coffee Cupping #8", emoji: "☕", participants: 3, state: "抽選受付中",
      organizer: { name: "佐藤 美咲", age: 29, job: "マーケター", avatar: "佐" },
      info: { date: "7月5日（日）11:00〜", place: "COFFEE LAB 渋谷", capacity: "8名", fee: "¥3,200" },
      announcement:
        "シングルオリジン3種をスペシャルティコーヒー専門家とカッピングします。香りと味わいの違いを丁寧に解説します。初心者歓迎！",
      messages: [
        { id: 1, name: "高橋 大輔", avatar: "高", body: "抽選申し込みました！当たりますように🙏", time: "1時間前" },
        { id: 2, name: "佐藤 美咲", avatar: "佐", body: "初心者の方も大歓迎です！お気軽にどうぞ", time: "50分前", isOrganizer: true },
      ],
    },
  },
  travel: {
    "1": {
      title: "金沢日帰りグルメ旅", emoji: "🚄", participants: 6, state: "受付中",
      organizer: { name: "加藤 恵子", age: 41, job: "会社経営", avatar: "加" },
      info: { date: "8月23日（日）07:30 東京駅集合", place: "金沢（近江町市場・ひがし茶屋街ほか）", capacity: "10名", fee: "¥15,000（交通費・食事代別）" },
      announcement:
        "北陸新幹線で金沢へ日帰り旅。近江町市場で海鮮を楽しんだ後、ひがし茶屋街・21世紀美術館を散策。夜は地元料理でディナーです。現地解散もOK！",
      messages: [
        { id: 1, name: "田中 康介", avatar: "/images/tanaka.png", body: "参加します！近江町市場楽しみ🦐", time: "5時間前" },
        { id: 2, name: "加藤 恵子", avatar: "加", body: "集合場所の詳細を送りました！確認お願いします🚄", time: "4時間前", isOrganizer: true },
      ],
    },
  },
};

// ============ Sub-components ============
function Avatar({ src, name, size = 10 }: { src: string; name: string; size?: number }) {
  const px = size * 4;
  const base = "rounded-full flex-none border border-[var(--color-line)] object-cover";
  if (src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={base} style={{ width: px, height: px, minWidth: px }} />;
  }
  return (
    <div className="rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display border border-[var(--color-line)]"
      style={{ width: px, height: px, minWidth: px, fontSize: size * 1.4 }}>
      {src}
    </div>
  );
}

// ============ Page ============
export default function ClubEventChatPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : (params.eventId ?? "");

  const router = useRouter();
  const ev = (CHAT_DATA[id] ?? {})[eventId];

  const [messages, setMessages] = useState<ChatMsg[]>(ev?.messages ?? []);
  const [input, setInput] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  if (!ev) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex items-center justify-center">
          <p className="font-display text-sm text-[var(--color-mute)]">イベントが見つかりません</p>
        </div>
      </div>
    );
  }

  function send() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), name: MY_NAME, avatar: MY_AVATAR, body: input.trim(), time: "たった今", fromMe: true }]);
    setInput("");
    setShowCompose(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const eventTemplate = `${ev.title}にご参加いただきありがとうございます！
${ev.info.date}に${ev.info.place}で開催予定です。
当日は初めましての方も多いと思うので、みなさん気軽にお声掛けください。
何かご質問があれば遠慮なくコメントしてください！`;

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${id}`} rightSlot={
          <div className="text-right">
            <div className="font-display text-sm truncate max-w-[180px]">{ev.emoji} {ev.title}</div>
            <div className="font-display text-[10px] text-[var(--color-mute)]">{ev.participants}人が参加中</div>
          </div>
        } />

        {/* ===== 編集・削除 ===== */}
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-b border-[var(--color-line)]">
          <Link href={`/clubs/${id}/create-event?edit=${eventId}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-display text-xs transition hover:bg-[var(--color-bg-soft)]"
            style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            編集
          </Link>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-display text-xs transition hover:bg-red-400/5"
            style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            削除
          </button>
        </div>

        {/* ===== ピン留め: イベント概要 ===== */}
        <div className="border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]">
          <button onClick={() => setShowInfo(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span className="font-display text-xs text-[var(--color-accent-deep)]">イベント概要</span>
              <span className={`tag text-[9px] px-2 py-0.5 ${ev.state === "受付中" ? "tag-accent" : ""}`}>{ev.state}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: showInfo ? "none" : "rotate(180deg)", transition: "transform 0.2s" }}>
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </button>

          {showInfo && (
            <div className="px-5 pb-4 space-y-3">
              {/* 主催者 */}
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-line)]">
                <Avatar src={ev.organizer.avatar} name={ev.organizer.name} size={11} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-semibold">{ev.organizer.name}</span>
                    <span className="font-display text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)" }}>主催</span>
                  </div>
                  <div className="font-display text-[11px] text-[var(--color-mute)] mt-0.5">{ev.organizer.age}歳・{ev.organizer.job}</div>
                </div>
              </div>
              {/* 概要グリッド */}
              <dl className="space-y-2 text-xs">
                {[
                  { label: "日時", value: ev.info.date },
                  { label: "場所", value: ev.info.place },
                  { label: "定員", value: ev.info.capacity },
                  { label: "参加費", value: ev.info.fee },
                ].map(row => (
                  <div key={row.label} className="flex gap-3">
                    <dt className="font-display text-[var(--color-mute)] w-12 flex-none">{row.label}</dt>
                    <dd className="font-display text-[var(--color-ink)] flex-1">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* ===== 主催者の告知（最初のメッセージ） ===== */}
        <div className="px-4 pt-4">
          <div className="flex gap-2.5">
            <Avatar src={ev.organizer.avatar} name={ev.organizer.name} size={9} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-display text-xs font-semibold">{ev.organizer.name}</span>
                <span className="font-display text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)" }}>主催</span>
              </div>
              <div className="rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                style={{ background: "var(--color-bg-soft)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}>
                {ev.announcement}
              </div>
            </div>
          </div>
        </div>

        {/* ===== チャット ===== */}
        <div className="px-4 py-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 items-end ${m.fromMe ? "flex-row-reverse" : ""}`}>
              {!m.fromMe && <Avatar src={m.avatar} name={m.name} size={8} />}
              <div className={`max-w-[240px] ${m.fromMe ? "items-end" : ""} flex flex-col`}>
                {!m.fromMe && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <span className="font-display text-[11px] text-[var(--color-mute)]">{m.name}</span>
                    {m.isOrganizer && (
                      <span className="font-display text-[8px] px-1 py-0.5 rounded-full" style={{ background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)" }}>主催</span>
                    )}
                  </div>
                )}
                <div className="text-sm px-4 py-2.5 rounded-2xl leading-relaxed"
                  style={m.fromMe
                    ? { background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16", borderTopRightRadius: 4 }
                    : { background: "var(--color-bg-soft)", color: "var(--color-ink)", border: "1px solid var(--color-line)", borderTopLeftRadius: 4 }}>
                  {m.body}
                </div>
                <span className={`font-display text-[10px] text-[var(--color-mute)] mt-1 ${m.fromMe ? "text-right mr-1" : "ml-1"}`}>{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ===== 投稿ボタン（FAB） ===== */}
        <button onClick={() => setShowCompose(true)}
          className="fixed z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", bottom: "calc(57px + 12px)", right: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <BottomNav />

        {/* ===== Compose Modal ===== */}
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowCompose(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
              <button
                onClick={() => setInput(eventTemplate)}
                className="flex items-center gap-1.5 mb-3 px-3.5 py-2 rounded-full border font-display text-xs transition hover:bg-[var(--color-accent)]/6"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-deep)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                クラブ会開催テンプレートを使う
              </button>
              <div className="flex gap-3 mb-4">
                <Avatar src={MY_AVATAR} name={MY_NAME} size={10} />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="メッセージを入力..." rows={4} value={input}
                    onChange={e => setInput(e.target.value)} autoFocus />
                </div>
              </div>
              <div className="flex items-center justify-end border-t border-[var(--color-line)] pt-3">
                <button onClick={send} disabled={!input.trim()}
                  className="font-display text-sm px-6 py-2.5 rounded-full transition disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                  送信する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== 削除確認 ===== */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowDeleteConfirm(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl pt-4 pb-10" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <div className="px-5 mb-5">
                <div className="font-display text-base font-semibold mb-1">イベントを削除しますか？</div>
                <div className="font-display text-xs text-[var(--color-mute)]">{ev.emoji} {ev.title}</div>
              </div>
              <div className="mx-5 mb-5 rounded-2xl border border-red-400/30 bg-red-400/5 px-4 py-4">
                <p className="font-display text-xs text-[var(--color-ink)] leading-relaxed">削除するとこのイベントとチャットは元に戻せません。参加者にも通知されます。</p>
              </div>
              <div className="px-5 space-y-3">
                <button onClick={() => router.push(`/clubs/${id}`)}
                  className="w-full py-3.5 rounded-full font-display text-sm transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white" }}>
                  削除する
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
