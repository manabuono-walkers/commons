"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Category = "report" | "other";
type Tab = Category | "closed";

interface ThreadMessage { from: "user" | "admin"; text: string; date: string; }

interface Thread {
  id: string; category: Category; subject: string; from: string; no: string;
  date: string; status: string; reportReason?: string; closed: boolean;
  reopened?: boolean;
  messages: ThreadMessage[];
}

const initialThreads: Thread[] = [
  { id:"RP-0012", category:"report", subject:"DMで不適切な勧誘を受けた", from:"山本 彩花", no:"0885", date:"2026.07.10 20:11", status:"未読", closed:false,
    reportReason:"ネットワークビジネス・投資案件等の勧誘行為",
    messages:[
      { from:"user", text:"DMで知らない会員から投資案件への勧誘を受けました。COMMONSの規約に違反していると思うので報告します。相手のユーザー名は「naoki_invest」です。", date:"2026.07.10 20:11" },
      { from:"admin", text:"ご報告ありがとうございます。運営にて該当のDMを確認いたします。差し支えなければ、受け取った日時をお教えいただけますでしょうか。", date:"2026.07.10 21:02" },
      { from:"user", text:"7月9日の22時頃だったと思います。スクリーンショットも残しています。", date:"2026.07.10 21:20" },
    ] },
  { id:"RP-0011", category:"report", subject:"クラブ内での迷惑行為の通報", from:"森田 桂", no:"0851", date:"2026.07.06 13:02", status:"返信済み", closed:true,
    reportReason:"他会員が不快・不安・負担を感じる迷惑行為",
    messages:[
      { from:"user", text:"ワインクラブの集まりで、他の会員に対して繰り返し連絡をしている方がいて困っています。ご確認をお願いします。", date:"2026.07.06 13:02" },
      { from:"admin", text:"ご連絡ありがとうございます。差し支えなければ、該当の方のお名前または会員番号をお教えいただけますか。", date:"2026.07.06 15:10" },
      { from:"user", text:"会員番号 #0843 の方です。よろしくお願いします。", date:"2026.07.06 16:44" },
      { from:"admin", text:"ご報告ありがとうございます。運営にて事実確認のうえ、該当会員へ注意喚起を行いました。引き続き何かございましたらご連絡ください。", date:"2026.07.06 18:30" },
    ] },
  { id:"OT-0007", category:"other", subject:"取材・メディア掲載のご相談", from:"青山 陸", no:"0824", date:"2026.07.07 10:45", status:"未読", closed:false,
    messages:[
      { from:"user", text:"知人の編集者からCOMMONSを取材したいという相談を受けました。窓口を教えていただけますか。", date:"2026.07.07 10:45" },
      { from:"admin", text:"お問い合わせありがとうございます。取材のご相談は運営広報にて承っております。媒体名と企画概要をお送りいただけますか。", date:"2026.07.07 11:30" },
      { from:"user", text:"承知しました。媒体は都内のライフスタイル誌で、会員制コミュニティの特集企画とのことです。", date:"2026.07.07 12:05" },
    ] },
  { id:"OT-0006", category:"other", subject:"法人プランについて相談したい", from:"中村 優一", no:"0898", date:"2026.07.04 16:20", status:"返信済み", closed:false,
    messages:[
      { from:"user", text:"会社として複数名を法人契約したいのですが、そういったプランはありますか。", date:"2026.07.04 16:20" },
      { from:"admin", text:"法人向けプランは現在準備中です。詳細が決まり次第ご案内いたします。", date:"2026.07.05 09:15" },
      { from:"user", text:"ありがとうございます。目安として何名から対応いただけそうでしょうか。", date:"2026.07.05 10:02" },
      { from:"admin", text:"5名以上を想定して設計しております。ご要望として社内に共有いたします。", date:"2026.07.05 11:40" },
    ] },
  { id:"OT-0005", category:"other", subject:"イベント当日の持ち物について相談したい", from:"田中 康介", no:"0880", date:"2026.06.30 19:12", status:"返信済み", closed:true,
    messages:[
      { from:"user", text:"7月15日のCOMMONS MUSIC BAR、当日はどんな服装・持ち物が良いですか？", date:"2026.06.30 19:12" },
      { from:"admin", text:"服装は特に指定ございません。会員証（アプリ画面）をご提示ください。", date:"2026.06.30 20:05" },
      { from:"user", text:"承知しました。ありがとうございます。", date:"2026.06.30 20:20" },
    ] },
  { id:"OT-0004", category:"other", subject:"退会後の再入会について", from:"伊藤 健", no:"0891", date:"2026.06.24 14:05", status:"未読", closed:false, reopened:true,
    messages:[
      { from:"user", text:"一度退会した場合、再入会の際にあらためて審査が必要でしょうか。", date:"2026.06.24 14:05" },
      { from:"admin", text:"再入会の際も改めて審査をお願いしております。ご不明点があればご連絡ください。", date:"2026.06.24 16:30" },
      { from:"admin", text:"（本件はクローズいたしました）", date:"2026.06.25 09:00" },
      { from:"user", text:"追加で伺いたいのですが、審査の際に以前の在籍履歴は考慮されますか？", date:"2026.07.09 08:41" },
    ] },
];

const MEMBER_DIRECTORY = [
  { no:"0824", name:"青山 陸" }, { no:"0827", name:"佐藤 美咲" }, { no:"0830", name:"中島 誉" },
  { no:"0843", name:"山本 直" }, { no:"0851", name:"森田 桂" }, { no:"0873", name:"村瀬 史奈" },
  { no:"0880", name:"田中 康介" }, { no:"0885", name:"山本 彩花" }, { no:"0891", name:"伊藤 健" },
  { no:"0898", name:"中村 優一" },
];

const catLabel: Record<Tab, string> = { report: "通報", other: "個別連絡", closed: "クローズ" };
const statusColor: Record<string, string> = { "未読": "tag-ink" };

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function InquiriesContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "report";
  const initialUser = searchParams.get("user") ?? "";
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [tab, setTab] = useState<Tab>(initialTab in catLabel ? initialTab : "report");
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [otherUserQuery, setOtherUserQuery] = useState(initialUser);
  const [otherFreeQuery, setOtherFreeQuery] = useState("");
  const [otherDateFrom, setOtherDateFrom] = useState("");
  const [otherDateTo, setOtherDateTo] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeQuery, setComposeQuery] = useState("");
  const [composeMember, setComposeMember] = useState<{no:string; name:string} | null>(null);
  const [composeMessage, setComposeMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const list = threads
    .filter(t => tab === "closed" ? t.closed : t.category === tab && !t.closed)
    .filter(t => {
      if (tab !== "other") return true;
      if (otherUserQuery && !t.from.includes(otherUserQuery) && !t.no.includes(otherUserQuery)) return false;
      if (otherFreeQuery) {
        const q = otherFreeQuery.toLowerCase();
        const hit = t.subject.toLowerCase().includes(q) || t.messages.some(m => m.text.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (otherDateFrom && t.date.replace(/\./g,"-") < otherDateFrom.replace(/\./g,"-")) return false;
      if (otherDateTo && t.date.replace(/\./g,"-") > otherDateTo.replace(/\./g,"-")) return false;
      return true;
    });
  const thread = selected ? threads.find(t => t.id === selected) : undefined;
  const unreadTotal = threads.filter(t => t.status === "未読" && !t.closed).length;
  const otherHasFilter = otherUserQuery || otherFreeQuery || otherDateFrom || otherDateTo;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ block: "end" });
  }, [selected, thread?.messages.length]);

  function closeThread(id: string) {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, closed: true } : t));
    setSelected(null);
  }

  // クローズ済みスレッドに相手から新着が届いた場合、クローズを解除して「個別連絡」に戻す
  function receiveNewMessage(id: string) {
    const stamp = nowStamp();
    setThreads(prev => prev.map(t => t.id === id ? {
      ...t,
      closed: false,
      reopened: true,
      category: "other" as Category,
      status: "未読",
      date: stamp,
      messages: [...t.messages, { from: "user" as const, text: "先日の件で追加でご相談したいことがあり、あらためてご連絡しました。", date: stamp }],
    } : t));
    setTab("other");
    setSelected(id);
  }

  function sendReply() {
    if (!thread || !reply.trim()) return;
    const stamp = nowStamp();
    const id = thread.id;
    setThreads(prev => prev.map(t => t.id === id ? {
      ...t,
      status: "返信済み",
      messages: [...t.messages, { from: "admin" as const, text: reply.trim(), date: stamp }],
    } : t));
    setReply("");
  }

  const composeCandidates = MEMBER_DIRECTORY.filter(m =>
    !composeQuery || m.name.includes(composeQuery) || m.no.includes(composeQuery)
  );

  function sendCompose() {
    if (!composeMember || !composeMessage.trim()) return;
    const stamp = nowStamp();
    const newThread: Thread = {
      id: `OT-${Date.now()}`, category: "other", subject: "運営からの個別メッセージ",
      from: composeMember.name, no: composeMember.no, date: stamp, status: "返信済み", closed: false,
      messages: [{ from: "admin", text: composeMessage, date: stamp }],
    };
    setThreads(prev => [newThread, ...prev]);
    setTab("other");
    setSelected(newThread.id);
    setShowCompose(false);
    setComposeMember(null);
    setComposeMessage("");
    setComposeQuery("");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-4 sm:px-8 py-6 border-b border-[var(--color-line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">INQUIRY</div>
          <h1 className="font-display text-2xl mt-0.5">通報・個別連絡</h1>
        </div>
        <div className="font-display text-xs text-[var(--color-mute)]">未読 <span className="num text-[var(--color-accent-deep)]">{unreadTotal}</span> 件</div>
      </div>

      <div className="px-4 sm:px-8 border-b border-[var(--color-line)] flex gap-4 sm:gap-6 flex-none overflow-x-auto whitespace-nowrap">
        {(Object.keys(catLabel) as Tab[]).map(k => (
          <button key={k} onClick={() => { setTab(k); setSelected(null); setShowCompose(false); }}
            className={`font-display text-sm py-4 border-b-2 transition flex-none ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {catLabel[k]}
            <span className="ml-1.5 font-display text-[10px] text-[var(--color-mute)]">
              ({k === "closed" ? threads.filter(t=>t.closed).length : threads.filter(t=>t.category===k && !t.closed).length})
            </span>
          </button>
        ))}
      </div>

      {tab === "other" && (
        <div className="px-4 sm:px-8 py-3 border-b border-[var(--color-line)] flex-none flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
          <input value={otherUserQuery} onChange={e=>setOtherUserQuery(e.target.value)} placeholder="ユーザー名・会員番号"
            className="w-full sm:w-44 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
          <input value={otherFreeQuery} onChange={e=>setOtherFreeQuery(e.target.value)} placeholder="個別連絡をフリーワード検索"
            className="w-full sm:w-52 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">日時</span>
            <input type="date" value={otherDateFrom} onChange={e=>setOtherDateFrom(e.target.value)} className="min-w-0 flex-1 sm:flex-none bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
            <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">〜</span>
            <input type="date" value={otherDateTo} onChange={e=>setOtherDateTo(e.target.value)} className="min-w-0 flex-1 sm:flex-none bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            {otherHasFilter && (
              <button onClick={() => { setOtherUserQuery(""); setOtherFreeQuery(""); setOtherDateFrom(""); setOtherDateTo(""); }}
                className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">クリア</button>
            )}
            <button onClick={() => { setShowCompose(true); setSelected(null); }} className="btn-primary !py-1.5 text-xs">＋ メッセージ作成</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* List: users in this category */}
        <div className={`w-full md:w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none ${(selected || showCompose) ? "hidden md:block" : ""}`}>
          {list.map(t => (
            <button key={t.id} onClick={() => { setSelected(t.id); setShowCompose(false); }} className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${!showCompose && selected === t.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
              <div className="flex items-start justify-between mb-1 gap-2">
                <span className="font-display text-sm leading-tight flex-1">{t.subject}</span>
                {statusColor[t.status] && <span className={`tag text-[9px] flex-none ${statusColor[t.status]}`}>{t.status}</span>}
              </div>
              {t.reopened && !t.closed && (
                <span className="tag text-[9px] mb-1 inline-block">クローズ後に再開</span>
              )}
              <div className="font-display text-[10px] text-[var(--color-mute)]">{t.from}（#{t.no}）</div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{t.date}</div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="px-5 py-8 text-center font-display text-xs text-[var(--color-mute)]">該当するやり取りはありません</div>
          )}
        </div>

        {/* Empty placeholder (desktop only) */}
        {!showCompose && !thread && (
          <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--color-bg-soft)]">
            <span className="font-display text-sm text-[var(--color-mute)]">スレッドを選択してください</span>
          </div>
        )}

        {/* Compose new message */}
        {showCompose ? (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-[560px]">
              <button onClick={() => setShowCompose(false)} className="md:hidden font-display text-[11px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-4">← 一覧に戻る</button>
              <h2 className="font-display text-lg mb-5">メッセージ作成</h2>
              {!composeMember ? (
                <>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">会員番号・氏名で検索</label>
                  <input value={composeQuery} onChange={e=>setComposeQuery(e.target.value)} placeholder="例: 0880 / 田中 康介"
                    className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] mb-4" />
                  <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                    {composeCandidates.map(m => (
                      <button key={m.no} onClick={() => setComposeMember(m)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-[var(--color-line)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/5 transition flex items-center justify-between">
                        <span className="font-display text-sm">{m.name}</span>
                        <span className="num text-xs text-[var(--color-mute)]">#{m.no}</span>
                      </button>
                    ))}
                    {composeCandidates.length === 0 && (
                      <div className="text-center font-display text-xs text-[var(--color-mute)] py-4">該当する会員がいません</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/8">
                    <div>
                      <div className="font-display text-sm">{composeMember.name}</div>
                      <div className="num text-xs text-[var(--color-mute)]">#{composeMember.no}</div>
                    </div>
                    <button onClick={() => setComposeMember(null)} className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-ink)]">変更</button>
                  </div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">メッセージ内容</label>
                  <textarea value={composeMessage} onChange={e=>setComposeMessage(e.target.value)} rows={5} placeholder="送信するメッセージを入力してください..."
                    className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none mb-4" />
                  <div className="flex gap-3">
                    <button onClick={sendCompose} disabled={!composeMessage.trim()} className="btn-primary !py-2 text-xs disabled:opacity-40">送信する</button>
                    <button onClick={() => setShowCompose(false)} className="btn-outline !py-2 text-xs">キャンセル</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : thread && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-line)] flex-none">
              <button onClick={() => setSelected(null)} className="md:hidden font-display text-[11px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-3">← 一覧に戻る</button>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg leading-snug">{thread.subject}</h2>
                  <div className="font-display text-xs text-[var(--color-mute)] mt-1">{thread.from}（#{thread.no}）· {thread.date}</div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {thread.reopened && !thread.closed && <span className="tag text-[9px]">クローズ後に再開</span>}
                  {statusColor[thread.status] && <span className={`tag text-[9px] ${statusColor[thread.status]}`}>{thread.status}</span>}
                  {!thread.closed && (
                    <button onClick={() => closeThread(thread.id)} className="btn-outline !py-1.5 text-xs">クローズ</button>
                  )}
                  {thread.closed && (
                    <button onClick={() => receiveNewMessage(thread.id)} className="btn-outline !py-1.5 text-xs">新着メッセージを受信（デモ）</button>
                  )}
                </div>
              </div>
              {thread.reportReason && (
                <div className="mt-3 px-4 py-2.5 rounded-xl bg-red-400/10 border border-red-400/30 font-display text-xs text-red-400">
                  通報理由: {thread.reportReason}
                </div>
              )}
              {thread.closed && (
                <div className="mt-3 px-4 py-2.5 rounded-xl bg-[var(--color-bg-soft)] border border-[var(--color-line)] font-display text-[11px] text-[var(--color-mute)] leading-relaxed">
                  このスレッドはクローズ済みです。相手から新しいメッセージが届くと自動的に再オープンされ、「個別連絡」タブに戻ります。
                </div>
              )}
            </div>

            {/* Chat thread (DM style) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5">
              <div className="max-w-[640px] mx-auto space-y-4">
                {thread.messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.from === "admin" ? "items-end" : "items-start"}`}>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mb-1 px-1">
                      {m.from === "admin" ? "COMMONS 運営" : `${thread.from}（#${thread.no}）`}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[70%] text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
                      m.from === "admin"
                        ? "bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-ink)]"
                        : "bg-[var(--color-bg-soft)] border border-[var(--color-line)] text-[var(--color-ink)]"
                    }`}>
                      {m.text}
                    </div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-1 px-1">{m.date}</div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Composer fixed at bottom */}
            {!thread.closed && (
              <div className="px-4 sm:px-8 py-3 border-t border-[var(--color-line)] flex-none bg-[var(--color-bg)]">
                <div className="max-w-[640px] mx-auto flex items-end gap-2">
                  <input
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    placeholder="メッセージを入力..."
                    className="flex-1 min-w-0 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  <button onClick={sendReply} disabled={!reply.trim()} className="btn-primary !py-2 !px-5 text-xs flex-none disabled:opacity-40">送信</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <Suspense>
      <InquiriesContent />
    </Suspense>
  );
}
