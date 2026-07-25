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

const statusLabel: Record<ClubApplication["status"], string> = { pending: "審査中", approved: "承認済み", rejected: "否認済み" };
const statusClass: Record<ClubApplication["status"], string> = {
  pending: "border-[var(--color-accent)]/40 text-[var(--color-accent-deep)]",
  approved: "border-green-500/40 text-green-400",
  rejected: "border-red-400/40 text-red-400",
};

type Tab = "applications" | "members";

export default function ClubsPage() {
  const [tab, setTab] = useState<Tab>("applications");
  const [applications, setApplications] = useState<ClubApplication[]>(initialApplications);
  const [clubs] = useState<Club[]>(initialClubs);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const selectedClub = clubs.find(c => c.id === selectedClubId);

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
        {([["applications", "クラブ作成申請"], ["members", "参加者確認"]] as const).map(([k, l]) => (
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
