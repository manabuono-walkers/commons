"use client";
import { useState } from "react";

// ============ 型定義 ============
interface ClubApplication {
  id: string;
  clubName: string;
  desc: string;
  applicantName: string;
  applicantNo: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

interface ClubMember { no: string; name: string; joinedAt: string; }
interface Club { id: string; name: string; members: ClubMember[]; }
interface ClubEvent {
  id: string; clubId: string; title: string; date: string; time: string; endTime: string;
  venue: string; fee: string; capacity: string; desc: string;
}

// ============ ダミーデータ ============
const initialApplications: ClubApplication[] = [
  { id: "req-1", clubName: "読書クラブ", desc: "月1回の読書会・おすすめ本の紹介会を開催したいです。", applicantName: "青山 陸", applicantNo: "0824", appliedAt: "2026.07.10 14:22", status: "pending" },
  { id: "req-2", clubName: "登山クラブ", desc: "週末に低山ハイキングを企画し、自然の中で交流を深めたいです。", applicantName: "伊藤 健", applicantNo: "0891", appliedAt: "2026.07.09 09:05", status: "pending" },
  { id: "req-3", clubName: "映画鑑賞クラブ", desc: "月2回、話題の映画を見に行き感想を語り合う会にしたいです。", applicantName: "佐藤 美咲", applicantNo: "0827", appliedAt: "2026.07.05 20:11", status: "approved" },
  { id: "req-4", clubName: "深夜ラーメン部", desc: "深夜に集まってラーメン巡りをする会。", applicantName: "中村 優一", applicantNo: "0898", appliedAt: "2026.06.28 23:40", status: "rejected", rejectReason: "既存の「グルメクラブ」と活動内容が重複するため" },
];

const initialClubs: Club[] = [
  { id: "wine", name: "ワインクラブ", members: [
    { no: "0824", name: "青山 陸", joinedAt: "2025.08.01" },
    { no: "0880", name: "田中 康介", joinedAt: "2025.07.12" },
    { no: "0885", name: "山本 彩花", joinedAt: "2025.03.01" },
  ] },
  { id: "coffee", name: "コーヒークラブ", members: [
    { no: "0880", name: "田中 康介", joinedAt: "2025.09.15" },
    { no: "0827", name: "佐藤 美咲", joinedAt: "2025.05.27" },
  ] },
  { id: "photo", name: "フォトウォーク部", members: [
    { no: "0885", name: "山本 彩花", joinedAt: "2026.01.10" },
  ] },
  { id: "jazz", name: "ジャズ部", members: [
    { no: "0830", name: "中島 誉", joinedAt: "2026.02.20" },
  ] },
  { id: "art", name: "アート部", members: [
    { no: "0873", name: "村瀬 史奈", joinedAt: "2026.01.10" },
  ] },
];

const initialClubEvents: ClubEvent[] = [
  { id: "ce-1", clubId: "wine", title: "気軽な交流会", date: "2026-07-25", time: "18:00", endTime: "21:00", venue: "新宿", fee: "男性 6,000円 / 女性 4,000円", capacity: "10", desc: "気軽に話せる場を作りたくて、少人数の交流会を企画しました。形式ばった会ではなく、落ち着いて会話ができる時間にしたいと思っています。仕事以外のつながりを作りたい方や、新しい人と話してみたい方はぜひ。" },
  { id: "ce-2", clubId: "wine", title: "シャンパーニュ特集 Vol.3", date: "2026-07-12", time: "19:00", endTime: "21:00", venue: "La Cave 麻布十番", fee: "¥8,500", capacity: "12", desc: "銘醸シャンパーニュをヴィンテージ違いで飲み比べ。醸造家による特別解説付き。ドレスコードはスマートカジュアルでお越しください。" },
  { id: "ce-3", clubId: "wine", title: "ボルドー格付け比較会", date: "2026-08-02", time: "18:30", endTime: "21:00", venue: "Atelier du Vin 銀座", fee: "¥11,000", capacity: "10", desc: "1〜5級シャトーを縦断してテイスティング。格付けと価格の関係を体感できる贅沢な一夜。専門家の解説付き。" },
  { id: "ce-4", clubId: "wine", title: "秋のブルゴーニュナイト Vol.13", date: "2026-09-06", time: "19:00", endTime: "21:00", venue: "La Cave 麻布十番", fee: "¥9,500", capacity: "12", desc: "ブルゴーニュの赤・白をヴィンテージ違いで楽しむ人気シリーズ第13弾。ソムリエによる詳細解説もあります。" },
  { id: "ce-5", clubId: "coffee", title: "Sunday Coffee Cupping #8", date: "2026-07-05", time: "11:00", endTime: "13:00", venue: "COFFEE LAB 渋谷", fee: "¥3,200", capacity: "8", desc: "シングルオリジン3種をスペシャルティコーヒー専門家とカッピング。香りと味わいの違いを丁寧に解説します。初心者歓迎。" },
  { id: "ce-6", clubId: "photo", title: "谷中フォトウォーク", date: "2026-07-27", time: "09:00", endTime: "12:00", venue: "谷中エリア", fee: "¥2,000", capacity: "20", desc: "下町情緒あふれる谷中を歩きながら、それぞれの「好き」な瞬間をカメラに収めます。" },
  { id: "ce-7", clubId: "jazz", title: "ジャズ鑑賞会", date: "2026-08-10", time: "19:00", endTime: "21:00", venue: "The Library 渋谷", fee: "¥3,500", capacity: "15", desc: "名盤レコードを聴きながら語り合う鑑賞会。" },
];

const statusLabel: Record<ClubApplication["status"], string> = { pending: "審査中", approved: "承認済み", rejected: "否認済み" };
const statusClass: Record<ClubApplication["status"], string> = {
  pending: "border-[var(--color-accent)]/40 text-[var(--color-accent-deep)]",
  approved: "border-green-500/40 text-green-400",
  rejected: "border-red-400/40 text-red-400",
};

type Tab = "applications" | "members" | "events";

export default function ClubsPage() {
  const [tab, setTab] = useState<Tab>("applications");
  const [applications, setApplications] = useState<ClubApplication[]>(initialApplications);
  const [clubs] = useState<Club[]>(initialClubs);
  const [clubEvents, setClubEvents] = useState<ClubEvent[]>(initialClubEvents);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [eventsClubId, setEventsClubId] = useState<string | null>(clubs[0]?.id ?? null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventEditing, setEventEditing] = useState(false);
  const [editEventTitle, setEditEventTitle] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventTime, setEditEventTime] = useState("");
  const [editEventEndTime, setEditEventEndTime] = useState("");
  const [editEventVenue, setEditEventVenue] = useState("");
  const [editEventFee, setEditEventFee] = useState("");
  const [editEventCapacity, setEditEventCapacity] = useState("");
  const [editEventDesc, setEditEventDesc] = useState("");
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const selectedClub = clubs.find(c => c.id === selectedClubId);
  const eventsClub = clubs.find(c => c.id === eventsClubId);
  const clubEventList = clubEvents.filter(e => e.clubId === eventsClubId);
  const selectedEvent = clubEvents.find(e => e.id === selectedEventId);

  function openEventEdit(e: ClubEvent) {
    setSelectedEventId(e.id); setEditEventTitle(e.title); setEditEventDate(e.date);
    setEditEventTime(e.time); setEditEventEndTime(e.endTime); setEditEventVenue(e.venue);
    setEditEventFee(e.fee); setEditEventCapacity(e.capacity); setEditEventDesc(e.desc);
    setEventEditing(true);
  }
  function saveEventEdit() {
    if (!selectedEventId) return;
    setClubEvents(prev => prev.map(e => e.id === selectedEventId ? {
      ...e, title: editEventTitle, date: editEventDate, time: editEventTime, endTime: editEventEndTime,
      venue: editEventVenue, fee: editEventFee, capacity: editEventCapacity, desc: editEventDesc,
    } : e));
    setEventEditing(false);
  }
  function deleteEvent(id: string) {
    if (!confirm("このイベントを削除しますか？")) return;
    setClubEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEventId === id) { setSelectedEventId(null); setEventEditing(false); }
  }

  function approve(id: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "approved", rejectReason: undefined } : a));
  }
  function confirmReject() {
    if (!rejectModalId) return;
    setApplications(prev => prev.map(a => a.id === rejectModalId ? { ...a, status: "rejected", rejectReason: rejectReasonInput || "理由未記入" } : a));
    setRejectModalId(null); setRejectReasonInput("");
  }

  function downloadMembersCSV() {
    const header = "会員番号,会員名,クラブ名,参加日時";
    const rows = clubs.flatMap(c => c.members.map(m => `${m.no},${m.name},${c.name},${m.joinedAt}`));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "club_members.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const pendingCount = applications.filter(a => a.status === "pending").length;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">CLUB</div>
          <h1 className="font-display text-2xl mt-0.5">クラブ管理</h1>
        </div>
        {tab === "members" && (
          <button onClick={downloadMembersCSV} className="btn-outline !py-2 text-xs">CSV出力</button>
        )}
      </div>

      {/* Inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["applications", "クラブ作成申請"], ["members", "参加者確認"], ["events", "イベント確認"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab === k ? "border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-transparent text-[var(--color-mute)]"}`}>
            {l}
            {k === "applications" && pendingCount > 0 && (
              <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[9px]">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===== 申請管理タブ ===== */}
      {tab === "applications" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[300px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {applications.map(a => (
              <button key={a.id} onClick={() => setSelectedAppId(a.id)}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selectedAppId === a.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm">{a.clubName}</span>
                  <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${statusClass[a.status]}`}>{statusLabel[a.status]}</span>
                </div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">{a.applicantName} #{a.applicantNo}</div>
                <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">{a.appliedAt}</div>
              </button>
            ))}
          </div>

          {!selectedApp ? (
            <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-soft)]">
              <span className="font-display text-sm text-[var(--color-mute)]">申請を選択してください</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)] px-8 py-6">
              <div className="max-w-[560px]">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${statusClass[selectedApp.status]}`}>{statusLabel[selectedApp.status]}</span>
                    <h2 className="font-display text-xl mt-2">{selectedApp.clubName}</h2>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">申請者: {selectedApp.applicantName}（#{selectedApp.applicantNo}）・ {selectedApp.appliedAt}</div>
                  </div>
                  {selectedApp.status === "pending" && (
                    <div className="flex gap-2 flex-none">
                      <button onClick={() => setRejectModalId(selectedApp.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/40 text-red-400 hover:bg-red-400/8 transition">否認</button>
                      <button onClick={() => approve(selectedApp.id)} className="btn-primary !py-1.5 text-xs">承認</button>
                    </div>
                  )}
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">活動内容の説明</div>
                  <p className="text-sm text-[var(--color-mute)] leading-relaxed">{selectedApp.desc}</p>
                </div>
                {selectedApp.status === "rejected" && selectedApp.rejectReason && (
                  <div className="card p-5 border-red-400/20">
                    <div className="font-display text-[10px] text-red-400 mb-2">否認理由</div>
                    <p className="text-sm">{selectedApp.rejectReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 参加者確認タブ ===== */}
      {tab === "members" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[300px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {clubs.map(c => (
              <button key={c.id} onClick={() => setSelectedClubId(c.id)}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selectedClubId === c.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="font-display text-sm">{c.name}</div>
                <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">{c.members.length}名参加中</div>
              </button>
            ))}
          </div>

          {!selectedClub ? (
            <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-soft)]">
              <span className="font-display text-sm text-[var(--color-mute)]">クラブを選択してください</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)] px-8 py-6">
              <div className="max-w-[560px]">
                <h2 className="font-display text-xl mb-1">{selectedClub.name}</h2>
                <div className="font-display text-xs text-[var(--color-mute)] mb-5">参加者 {selectedClub.members.length}名</div>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="font-display text-[9px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                        <th className="px-5 py-3">会員番号</th><th className="px-5 py-3">氏名</th><th className="px-5 py-3">参加日時</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-line)]">
                      {selectedClub.members.map(m => (
                        <tr key={m.no} className="hover:bg-[var(--color-bg)] transition">
                          <td className="px-5 py-3 num text-xs">{m.no}</td>
                          <td className="px-5 py-3 font-display text-sm">{m.name}</td>
                          <td className="px-5 py-3 num text-xs text-[var(--color-mute)]">{m.joinedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== イベント確認タブ ===== */}
      {tab === "events" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[300px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {clubs.map(c => (
              <button key={c.id} onClick={() => { setEventsClubId(c.id); setSelectedEventId(null); setEventEditing(false); }}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${eventsClubId === c.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="font-display text-sm">{c.name}</div>
                <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">{clubEvents.filter(e => e.clubId === c.id).length}件のイベント</div>
              </button>
            ))}
          </div>

          <div className="w-[300px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {eventsClub && (
              <div className="px-5 py-3 border-b border-[var(--color-line)] font-display text-xs text-[var(--color-mute)]">{eventsClub.name} のイベント</div>
            )}
            {clubEventList.map(e => (
              <button key={e.id} onClick={() => { setSelectedEventId(e.id); setEventEditing(false); }}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selectedEventId === e.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="font-display text-sm">{e.title}</div>
                <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">{e.date} {e.time}〜{e.endTime} · {e.venue}</div>
              </button>
            ))}
            {clubEventList.length === 0 && (
              <div className="px-5 py-8 text-center font-display text-xs text-[var(--color-mute)]">このクラブのイベントはありません</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)] px-8 py-6">
            {!selectedEvent ? (
              <div className="flex items-center justify-center h-full">
                <span className="font-display text-sm text-[var(--color-mute)]">イベントを選択してください</span>
              </div>
            ) : !eventEditing ? (
              <div className="max-w-[560px]">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-display text-xl">{selectedEvent.title}</h2>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">{selectedEvent.date} {selectedEvent.time}〜{selectedEvent.endTime} · {selectedEvent.venue}</div>
                  </div>
                  <div className="flex gap-2 flex-none">
                    <button onClick={() => openEventEdit(selectedEvent)} className="btn-outline !py-1.5 text-xs">編集</button>
                    <button onClick={() => deleteEvent(selectedEvent.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    {l:"参加費",v:selectedEvent.fee},
                    {l:"定員",v:`${selectedEvent.capacity}名`},
                  ].map(r=>(
                    <div key={r.l} className="card p-4">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{r.l}</div>
                      <div className="text-sm">{r.v}</div>
                    </div>
                  ))}
                </div>
                <div className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">詳細・備考</div>
                  <p className="text-sm text-[var(--color-mute)] leading-relaxed">{selectedEvent.desc}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[560px] space-y-4">
                <h2 className="font-display text-xl mb-2">イベントを編集</h2>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">イベント名</label>
                  <input value={editEventTitle} onChange={e=>setEditEventTitle(e.target.value)} placeholder="例：シャンパーニュ特集 Vol.4"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">開催日</label>
                  <input type="date" value={editEventDate} onChange={e=>setEditEventDate(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">開始時間</label>
                    <input type="time" value={editEventTime} onChange={e=>setEditEventTime(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">終了時間</label>
                    <input type="time" value={editEventEndTime} onChange={e=>setEditEventEndTime(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">場所</label>
                  <input value={editEventVenue} onChange={e=>setEditEventVenue(e.target.value)} placeholder="例：La Cave 麻布十番 / 新宿"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">参加費</label>
                    <input value={editEventFee} onChange={e=>setEditEventFee(e.target.value)} placeholder="例：¥5,000"
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">定員</label>
                    <input type="number" value={editEventCapacity} onChange={e=>setEditEventCapacity(e.target.value)} placeholder="例：12"
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">詳細・備考</label>
                  <textarea value={editEventDesc} onChange={e=>setEditEventDesc(e.target.value)} rows={4}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-[var(--color-accent)]/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={saveEventEdit} className="flex-1 btn-primary justify-center text-sm">保存する</button>
                  <button onClick={() => setEventEditing(false)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 否認理由モーダル */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setRejectModalId(null); setRejectReasonInput(""); }}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-2">否認理由</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-5">否認理由を入力してください。申請者には通知されません（内部記録用）。</p>
            <textarea value={rejectReasonInput} onChange={e => setRejectReasonInput(e.target.value)} rows={4}
              placeholder="例: 既存クラブと活動内容が重複するため"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none" />
            <div className="flex gap-3 mt-5">
              <button onClick={confirmReject} className="flex-1 btn-primary justify-center text-sm !bg-red-500 !from-red-500 !to-red-600">否認を確定する</button>
              <button onClick={() => { setRejectModalId(null); setRejectReasonInput(""); }} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
