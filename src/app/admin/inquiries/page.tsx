"use client";
import { useState } from "react";

const inquiries = [
  { id: "IQ-0041", subject: "イベントのキャンセル方法を教えてください", from: "田中 康介", no: "0880", date: "2026.07.09 14:23", status: "未読", category: "イベント" },
  { id: "IQ-0040", subject: "クーポンが使用できませんでした", from: "佐藤 美咲", no: "0827", date: "2026.07.09 11:08", status: "未読", category: "クーポン" },
  { id: "IQ-0039", subject: "プランのアップグレードについて", from: "青山 陸", no: "0824", date: "2026.07.08 18:45", status: "未読", category: "プラン" },
  { id: "IQ-0038", subject: "退会手続きについて教えてください", from: "伊藤 健", no: "0891", date: "2026.07.08 09:12", status: "返信済み", category: "退会" },
  { id: "IQ-0037", subject: "ポイントの有効期限はありますか", from: "山本 彩花", no: "0885", date: "2026.07.07 20:33", status: "返信済み", category: "ポイント" },
];

const statusColor: Record<string, string> = {
  "未読": "tag-ink",
  "返信済み": "tag-accent",
};

export default function InquiriesPage() {
  const [selected, setSelected] = useState<string>(inquiries[0].id);
  const [reply, setReply] = useState("");
  const inq = inquiries.find(i => i.id === selected);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">INQUIRY</div>
          <h1 className="font-display text-2xl mt-0.5">問い合わせ対応</h1>
        </div>
        <div className="font-display text-xs text-[var(--color-mute)]">未読 <span className="num text-[var(--color-accent-deep)]">3</span> 件</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {inquiries.map(i => (
            <button key={i.id} onClick={() => setSelected(i.id)} className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selected === i.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-display text-sm leading-tight flex-1 pr-2">{i.subject}</span>
                <span className={`tag text-[9px] flex-none ${statusColor[i.status] || ""}`}>{i.status}</span>
              </div>
              <div className="font-display text-[10px] text-[var(--color-mute)]">{i.from} · {i.category}</div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{i.date}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {inq && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-[var(--color-line)] flex-none">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg">{inq.subject}</h2>
                  <div className="font-display text-xs text-[var(--color-mute)] mt-1">{inq.from}（#{inq.no}）· {inq.date}</div>
                </div>
                <div className="flex gap-2">
                  <span className={`tag text-[9px] ${statusColor[inq.status] || ""}`}>{inq.status}</span>
                  <button className="btn-outline !py-1.5 text-xs">クローズ</button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[640px] space-y-4">
                <div className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">{inq.from} さんからのメッセージ</div>
                  <p className="text-sm leading-relaxed">
                    {inq.subject.includes("キャンセル") && "お世話になっております。7月15日のCOMMONS MUSIC BARに申し込みましたが、急な予定が入り参加が難しくなりました。キャンセルの方法を教えていただけますでしょうか。"}
                    {inq.subject.includes("クーポン") && "先日、Coffee Commonsでクーポンを使用しようとしたところ、「このクーポンは使用できません」と表示されてしまいました。有効期限は2026.12.31となっているはずなのですが、どうすれば使用できるようになりますか？"}
                    {inq.subject.includes("プラン") && "現在StandardプランですがPremiumへのアップグレードを検討しています。アップグレード時の追加費用や特典の変更タイミングについて教えてください。"}
                    {inq.subject.includes("退会") && "退会を検討しています。退会手続きの方法と、退会後のポイントはどうなるか教えてください。"}
                    {inq.subject.includes("ポイント") && "保有しているポイントに有効期限はありますか？失効する前に使いたいので確認させてください。"}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-[var(--color-line)] flex-none">
              <div className="max-w-[640px]">
                <div className="font-display text-xs text-[var(--color-mute)] mb-2">返信を作成</div>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="返信内容を入力してください..." className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none mb-3" />
                <div className="flex gap-3">
                  <button className="btn-outline !py-2 text-xs">テンプレートを挿入</button>
                  <button className="btn-primary !py-2 text-xs">返信を送信</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
