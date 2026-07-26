"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type Category = "inquiry" | "report" | "other";
type Tab = Category | "closed";

interface ThreadMessage { from: "user" | "admin"; text: string; date: string; }

interface Thread {
  id: string; category: Category; subject: string; from: string; no: string;
  date: string; status: string; reportReason?: string; closed: boolean;
  messages: ThreadMessage[];
}

const initialThreads: Thread[] = [
  { id:"IQ-0041", category:"inquiry", subject:"イベントのキャンセル方法を教えてください", from:"田中 康介", no:"0880", date:"2026.07.09 14:23", status:"未読", closed:false,
    messages:[{ from:"user", text:"お世話になっております。7月15日のCOMMONS MUSIC BARに申し込みましたが、急な予定が入り参加が難しくなりました。キャンセルの方法を教えていただけますでしょうか。", date:"2026.07.09 14:23" }] },
  { id:"IQ-0040", category:"inquiry", subject:"クーポンが使用できませんでした", from:"佐藤 美咲", no:"0827", date:"2026.07.09 11:08", status:"未読", closed:false,
    messages:[{ from:"user", text:"先日、Coffee Commonsでクーポンを使用しようとしたところ、「このクーポンは使用できません」と表示されてしまいました。有効期限は2026.12.31となっているはずなのですが、どうすれば使用できるようになりますか？", date:"2026.07.09 11:08" }] },
  { id:"IQ-0038", category:"inquiry", subject:"退会手続きについて教えてください", from:"伊藤 健", no:"0891", date:"2026.07.08 09:12", status:"返信済み", closed:false,
    messages:[
      { from:"user", text:"退会を検討しています。退会手続きの方法と、退会後のポイントはどうなるか教えてください。", date:"2026.07.08 09:12" },
      { from:"admin", text:"お問い合わせありがとうございます。退会は会員マイページの「設定」から手続き可能です。保有ポイントは退会と同時に失効いたしますのでご了承ください。", date:"2026.07.08 15:40" },
    ] },
  { id:"RP-0012", category:"report", subject:"DMで不適切な勧誘を受けた", from:"山本 彩花", no:"0885", date:"2026.07.10 20:11", status:"未読", closed:false,
    reportReason:"ネットワークビジネス・投資案件等の勧誘行為",
    messages:[{ from:"user", text:"DMで知らない会員から投資案件への勧誘を受けました。COMMONSの規約に違反していると思うので報告します。相手のユーザー名は「naoki_invest」です。", date:"2026.07.10 20:11" }] },
  { id:"RP-0011", category:"report", subject:"クラブ内での迷惑行為の通報", from:"森田 桂", no:"0851", date:"2026.07.06 13:02", status:"返信済み", closed:true,
    reportReason:"他会員が不快・不安・負担を感じる迷惑行為",
    messages:[
      { from:"user", text:"ワインクラブの集まりで、他の会員に対して繰り返し連絡をしている方がいて困っています。ご確認をお願いします。", date:"2026.07.06 13:02" },
      { from:"admin", text:"ご報告ありがとうございます。運営にて事実確認のうえ、該当会員へ注意喚起を行いました。引き続き何かございましたらご連絡ください。", date:"2026.07.06 18:30" },
    ] },
  { id:"OT-0007", category:"other", subject:"取材・メディア掲載のご相談", from:"青山 陸", no:"0824", date:"2026.07.07 10:45", status:"未読", closed:false,
    messages:[{ from:"user", text:"知人の編集者からCOMMONSを取材したいという相談を受けました。窓口を教えていただけますか。", date:"2026.07.07 10:45" }] },
  { id:"OT-0006", category:"other", subject:"法人プランについて相談したい", from:"中村 優一", no:"0898", date:"2026.07.04 16:20", status:"返信済み", closed:false,
    messages:[
      { from:"user", text:"会社として複数名を法人契約したいのですが、そういったプランはありますか。", date:"2026.07.04 16:20" },
      { from:"admin", text:"法人向けプランは現在準備中です。詳細が決まり次第ご案内いたします。", date:"2026.07.05 09:15" },
    ] },
  { id:"OT-0005", category:"other", subject:"イベント当日の持ち物について相談したい", from:"田中 康介", no:"0880", date:"2026.06.30 19:12", status:"返信済み", closed:true,
    messages:[
      { from:"user", text:"7月15日のCOMMONS MUSIC BAR、当日はどんな服装・持ち物が良いですか？", date:"2026.06.30 19:12" },
      { from:"admin", text:"服装は特に指定ございません。会員証（アプリ画面）をご提示ください。", date:"2026.06.30 20:05" },
    ] },
];

const MEMBER_DIRECTORY = [
  { no:"0824", name:"青山 陸" }, { no:"0827", name:"佐藤 美咲" }, { no:"0830", name:"中島 誉" },
  { no:"0843", name:"山本 直" }, { no:"0851", name:"森田 桂" }, { no:"0873", name:"村瀬 史奈" },
  { no:"0880", name:"田中 康介" }, { no:"0885", name:"山本 彩花" }, { no:"0891", name:"伊藤 健" },
  { no:"0898", name:"中村 優一" },
];

const catLabel: Record<Tab, string> = { inquiry: "お問い合わせ", report: "通報", other: "個別やり取り", closed: "クローズ" };
const statusColor: Record<string, string> = { "未読": "tag-ink" };

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function InquiriesContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "inquiry";
  const initialUser = searchParams.get("user") ?? "";
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [tab, setTab] = useState<Tab>(initialTab in catLabel ? initialTab : "inquiry");
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
  const thread = threads.find(t => t.id === selected) ?? list[0];
  const unreadTotal = threads.filter(t => t.status === "未読" && !t.closed).length;
  const otherHasFilter = otherUserQuery || otherFreeQuery || otherDateFrom || otherDateTo;

  function closeThread(id: string) {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, closed: true } : t));
    setSelected(null);
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
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">INQUIRY</div>
          <h1 className="font-display text-2xl mt-0.5">通報・お問い合わせ・個別やり取り</h1>
        </div>
        <div className="font-display text-xs text-[var(--color-mute)]">未読 <span className="num text-[var(--color-accent-deep)]">{unreadTotal}</span> 件</div>
      </div>

      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {(Object.keys(catLabel) as Tab[]).map(k => (
          <button key={k} onClick={() => { setTab(k); setSelected(null); setShowCompose(false); }}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {catLabel[k]}
            <span className="ml-1.5 font-display text-[10px] text-[var(--color-mute)]">
              ({k === "closed" ? threads.filter(t=>t.closed).length : threads.filter(t=>t.category===k && !t.closed).length})
            </span>
          </button>
        ))}
      </div>

      {tab === "other" && (
        <div className="px-8 py-3 border-b border-[var(--color-line)] flex-none flex items-center gap-3 flex-wrap">
          <input value={otherUserQuery} onChange={e=>setOtherUserQuery(e.target.value)} placeholder="ユーザー名・会員番号"
            className="w-44 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
          <input value={otherFreeQuery} onChange={e=>setOtherFreeQuery(e.target.value)} placeholder="フリーワード検索"
            className="w-52 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] text-[var(--color-mute)]">日時</span>
            <input type="date" value={otherDateFrom} onChange={e=>setOtherDateFrom(e.target.value)} className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
            <span className="font-display text-[10px] text-[var(--color-mute)]">〜</span>
            <input type="date" value={otherDateTo} onChange={e=>setOtherDateTo(e.target.value)} className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
          </div>
          {otherHasFilter && (
            <button onClick={() => { setOtherUserQuery(""); setOtherFreeQuery(""); setOtherDateFrom(""); setOtherDateTo(""); }}
              className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">クリア</button>
          )}
          <button onClick={() => { setShowCompose(true); setSelected(null); }} className="btn-primary !py-1.5 text-xs ml-auto">＋ メッセージ作成</button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* List: users in this category */}
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {list.map(t => (
            <button key={t.id} onClick={() => { setSelected(t.id); setShowCompose(false); }} className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${!showCompose && (selected??list[0]?.id) === t.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-display text-sm leading-tight flex-1 pr-2">{t.subject}</span>
                {statusColor[t.status] && <span className={`tag text-[9px] flex-none ${statusColor[t.status]}`}>{t.status}</span>}
              </div>
              <div className="font-display text-[10px] text-[var(--color-mute)]">{t.from}（#{t.no}）</div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{t.date}</div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="px-5 py-8 text-center font-display text-xs text-[var(--color-mute)]">該当するやり取りはありません</div>
          )}
        </div>

        {/* Compose new message */}
        {showCompose ? (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-[560px]">
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
            <div className="px-8 py-5 border-b border-[var(--color-line)] flex-none">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg">{thread.subject}</h2>
                  <div className="font-display text-xs text-[var(--color-mute)] mt-1">{thread.from}（#{thread.no}）· {thread.date}</div>
                </div>
                <div className="flex gap-2">
                  {statusColor[thread.status] && <span className={`tag text-[9px] ${statusColor[thread.status]}`}>{thread.status}</span>}
                  {!thread.closed && (
                    <button onClick={() => closeThread(thread.id)} className="btn-outline !py-1.5 text-xs">クローズ</button>
                  )}
                </div>
              </div>
              {thread.reportReason && (
                <div className="mt-3 px-4 py-2.5 rounded-xl bg-red-400/10 border border-red-400/30 font-display text-xs text-red-400">
                  通報理由: {thread.reportReason}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[640px] space-y-3">
                {thread.messages.map((m, i) => (
                  <div key={i} className={`card p-5 ${m.from==="admin" ? "bg-[var(--color-accent)]/6 border-[var(--color-accent)]/20" : ""}`}>
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">
                      {m.from === "admin" ? "運営からの返信" : `${thread.from} さんからのメッセージ`}
                    </div>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">{m.date}</div>
                  </div>
                ))}
              </div>
            </div>
            {!thread.closed && (
              <div className="px-8 py-5 border-t border-[var(--color-line)] flex-none">
                <div className="max-w-[640px]">
                  <div className="font-display text-xs text-[var(--color-mute)] mb-2">返信を作成</div>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="返信内容を入力してください..." className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none mb-3" />
                  <div className="flex gap-3">
                    <button className="btn-primary !py-2 text-xs">返信を送信</button>
                  </div>
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
