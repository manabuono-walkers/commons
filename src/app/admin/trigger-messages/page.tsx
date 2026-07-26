"use client";
import { useState } from "react";

type Trigger = "登録時" | "入会審査承認時" | "イベント申込時" | "イベント前日" | "退会時" | "誕生日";

interface TriggerMessage {
  id: string; trigger: Trigger; title: string; body: string; channels: string[]; active: boolean;
}

const TRIGGERS: Trigger[] = ["登録時", "入会審査承認時", "イベント申込時", "イベント前日", "退会時", "誕生日"];

const initialMessages: TriggerMessage[] = [
  { id:"tm-01", trigger:"登録時", title:"COMMONSへようこそ", body:"COMMONSへのご登録ありがとうございます。まずはプロフィールを整えて、気になるクラブやイベントをチェックしてみましょう。", channels:["アプリ内通知","メール"], active:true },
  { id:"tm-02", trigger:"入会審査承認時", title:"入会審査を通過しました", body:"審査の結果、COMMONSへのご入会が承認されました。会員証はマイページからいつでもご確認いただけます。", channels:["アプリ内通知","メール"], active:true },
  { id:"tm-03", trigger:"イベント申込時", title:"イベントお申し込み完了", body:"イベントへのお申し込みを受け付けました。開催が近づきましたらリマインドをお送りします。", channels:["アプリ内通知"], active:true },
  { id:"tm-04", trigger:"イベント前日", title:"明日はイベント当日です", body:"明日開催のイベントをお楽しみに。会場・持ち物などの詳細はイベントページをご確認ください。", channels:["アプリ内通知","メール"], active:true },
  { id:"tm-05", trigger:"退会時", title:"ご退会のお手続きが完了しました", body:"これまでCOMMONSをご利用いただきありがとうございました。またのご参加をお待ちしております。", channels:["メール"], active:false },
  { id:"tm-06", trigger:"誕生日", title:"お誕生日おめでとうございます", body:"COMMONSより、お誕生日をお祝いしてポイントをプレゼントいたします。素敵な一年になりますように。", channels:["アプリ内通知"], active:true },
];

export default function TriggerMessagesPage() {
  const [messages, setMessages] = useState<TriggerMessage[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editChannels, setEditChannels] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  const selected = messages.find(m => m.id === selectedId);

  function openEdit(m: TriggerMessage) {
    setSelectedId(m.id); setEditTitle(m.title); setEditBody(m.body); setEditChannels(m.channels); setEditing(true);
  }
  function saveEdit() {
    if (!selectedId) return;
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, title: editTitle, body: editBody, channels: editChannels } : m));
    setEditing(false);
  }
  function toggleActive(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }
  function toggleChannel(c: string) {
    setEditChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">TRIGGER MESSAGE</div>
        <h1 className="font-display text-2xl mt-0.5">通知メッセージ管理</h1>
        <p className="font-display text-[11px] text-[var(--color-mute)] mt-1">登録時・イベント申込時など、特定のタイミングで自動配信されるメッセージを管理します。</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[360px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {TRIGGERS.map(t => (
            <div key={t}>
              <div className="px-5 py-2 font-display text-[9px] tracking-widest text-[var(--color-mute)] bg-[var(--color-bg-soft)]">{t}</div>
              {messages.filter(m => m.trigger === t).map(m => (
                <button key={m.id} onClick={() => { setSelectedId(m.id); setEditing(false); }}
                  className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selectedId===m.id?"bg-[var(--color-accent)]/8":"hover:bg-[var(--color-bg-soft)]"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-sm">{m.title}</span>
                    <span className={`tag text-[9px] ${m.active?"tag-accent":""}`}>{m.active?"配信中":"停止中"}</span>
                  </div>
                  <div className="font-display text-[10px] text-[var(--color-mute)]">{m.channels.join("・")}</div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {selected ? (
            <div className="max-w-[600px]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="tag text-[9px] mb-2 inline-block">{selected.trigger}</span>
                  <h2 className="font-display text-xl">{selected.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(selected.id)}
                    className={`font-display text-xs px-4 py-1.5 rounded-full border transition ${selected.active?"border-red-400/40 text-red-400 hover:bg-red-400/8":"border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8"}`}>
                    {selected.active?"配信を停止":"配信を再開"}
                  </button>
                  {!editing && <button onClick={() => openEdit(selected)} className="btn-outline !py-1.5 text-xs">編集</button>}
                </div>
              </div>

              {!editing ? (
                <>
                  <div className="card p-5 mb-4">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">配信チャンネル</div>
                    <div className="flex flex-wrap gap-1.5">{selected.channels.map(c => <span key={c} className="tag tag-accent text-[9px]">{c}</span>)}</div>
                  </div>
                  <div className="card p-5">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">配信内容</div>
                    <div className="text-sm leading-relaxed text-[var(--color-mute)] whitespace-pre-line bg-[var(--color-bg)] rounded-lg p-4">{selected.body}</div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">タイトル</label>
                    <input value={editTitle} onChange={e=>setEditTitle(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">本文</label>
                    <textarea value={editBody} onChange={e=>setEditBody(e.target.value)} rows={6}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-[var(--color-accent)]/50" />
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">配信チャンネル</label>
                    <div className="flex gap-2">
                      {["アプリ内通知","メール"].map(c => (
                        <button key={c} type="button" onClick={()=>toggleChannel(c)}
                          className={`font-display text-xs px-4 py-1.5 rounded-full border transition ${editChannels.includes(c)?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveEdit} className="flex-1 btn-primary justify-center text-sm">保存する</button>
                    <button onClick={() => setEditing(false)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--color-mute)] font-display text-sm">左からメッセージを選択してください</div>
          )}
        </div>
      </div>
    </div>
  );
}
