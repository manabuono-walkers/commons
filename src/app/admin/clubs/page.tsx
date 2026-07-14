"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Moderator { no: string; name: string; since: string; }

interface Club {
  id: string; name: string; desc: string; members: number; posts: number; events: number; active: boolean;
  moderators: Moderator[];
}

const memberOptions = [
  { no: "0824", name: "青山 陸" },
  { no: "0827", name: "佐藤 美咲" },
  { no: "0830", name: "中島 誉" },
  { no: "0843", name: "山本 直" },
  { no: "0851", name: "森田 桂" },
  { no: "0873", name: "村瀬 史奈" },
  { no: "0880", name: "田中 康介" },
  { no: "0885", name: "山本 彩花" },
  { no: "0891", name: "伊藤 健" },
  { no: "0898", name: "中村 優一" },
];

const initialClubs: Club[] = [
  { id: "wine", name: "ワインクラブ", desc: "月1〜2回のワイン会・テイスティング勉強会", members: 48, posts: 124, events: 3, active: true, moderators: [{ no: "0824", name: "青山 陸", since: "2025.08.01" }] },
  { id: "coffee", name: "コーヒークラブ", desc: "スペシャルティコーヒーの探求", members: 34, posts: 87, events: 2, active: true, moderators: [{ no: "0880", name: "田中 康介", since: "2025.09.15" }] },
  { id: "photo", name: "フォトウォーク部", desc: "街歩きしながら写真を撮る", members: 29, posts: 56, events: 1, active: true, moderators: [] },
  { id: "jazz", name: "ジャズ部", desc: "ジャズバー巡り・音楽談義", members: 17, posts: 32, events: 1, active: true, moderators: [] },
  { id: "art", name: "アート部", desc: "美術館・ギャラリー巡り", members: 22, posts: 41, events: 0, active: false, moderators: [{ no: "0873", name: "村瀬 史奈", since: "2026.01.10" }] },
];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [modTab, setModTab] = useState<"info" | "moderators">("info");
  const [modSearch, setModSearch] = useState("");

  const club = clubs.find(c => c.id === selected);

  function addModerator(clubId: string, memberNo: string) {
    const member = memberOptions.find(m => m.no === memberNo);
    if (!member) return;
    setClubs(prev => prev.map(c => {
      if (c.id !== clubId) return c;
      if (c.moderators.some(m => m.no === memberNo)) return c;
      return { ...c, moderators: [...c.moderators, { no: member.no, name: member.name, since: "2026.07.12" }] };
    }));
  }

  function removeModerator(clubId: string, memberNo: string) {
    setClubs(prev => prev.map(c => c.id !== clubId ? c : { ...c, moderators: c.moderators.filter(m => m.no !== memberNo) }));
  }

  const filteredOptions = memberOptions.filter(m =>
    !club?.moderators.some(mod => mod.no === m.no) &&
    (modSearch === "" || m.name.includes(modSearch) || m.no.includes(modSearch))
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">CLUB</div>
          <h1 className="font-display text-2xl mt-0.5">クラブ管理</h1>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary !py-2 text-xs">＋ クラブ作成</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Club list */}
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          <div className="divide-y divide-[var(--color-line)]">
            {clubs.map(c => (
              <button key={c.id}
                onClick={() => { setSelected(selected === c.id ? null : c.id); setModTab("info"); setModSearch(""); }}
                className={`w-full text-left px-6 py-4 transition hover:bg-[var(--color-bg-soft)] ${selected === c.id ? "bg-[var(--color-accent)]/8" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm">{c.name}</h3>
                    {c.moderators.length > 0 && <span className="tag tag-accent text-[9px]">MOD×{c.moderators.length}</span>}
                    {!c.active && <span className="tag text-[9px]">非公開</span>}
                  </div>
                </div>
                <p className="font-display text-xs text-[var(--color-mute)] mb-2">{c.desc}</p>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1">
                    <span className="num text-sm">{c.members}</span>
                    <span className="font-display text-[9px] text-[var(--color-mute)]">メンバー</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="num text-sm">{c.posts}</span>
                    <span className="font-display text-[9px] text-[var(--color-mute)]">投稿</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="num text-sm">{c.events}</span>
                    <span className="font-display text-[9px] text-[var(--color-mute)]">開催予定</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {!club && (
          <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-soft)]">
            <span className="font-display text-sm text-[var(--color-mute)]">クラブを選択してください</span>
          </div>
        )}

        {/* Right: Detail panel */}
        {club && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-soft)]">
            <div className="px-6 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg">{club.name}</h2>
                <p className="font-display text-xs text-[var(--color-mute)] mt-0.5">{club.desc}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)]">
              {[{l:"メンバー",v:club.members},{l:"投稿数",v:club.posts},{l:"開催予定",v:club.events}].map(s=>(
                <div key={s.l} className="px-6 py-4 text-center">
                  <div className="num text-2xl">{s.v}</div>
                  <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Sub tabs */}
            <div className="flex border-b border-[var(--color-line)] px-6">
              {([["info", "基本設定"], ["moderators", "モデレーター"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setModTab(key)}
                  className={`font-display text-xs py-3 mr-5 border-b-2 transition ${modTab === key ? "border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-transparent text-[var(--color-mute)]"}`}>
                  {label}
                  {key === "moderators" && club.moderators.length > 0 && (
                    <span className="ml-1 w-4 h-4 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[9px]">{club.moderators.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {modTab === "info" && (
                <div className="space-y-4 max-w-[480px]">
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">クラブ名</label>
                    <input defaultValue={club.name} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">説明</label>
                    <textarea defaultValue={club.desc} rows={3} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-3 py-2 text-sm outline-none resize-none" />
                  </div>
                  <ImageUpload label="クラブカバー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                  <div className="flex gap-3 pt-2">
                    <button className="btn-primary justify-center text-xs flex-1">保存する</button>
                    <button className="py-2.5 px-5 rounded-full font-display text-xs border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">クラブを削除</button>
                  </div>
                </div>
              )}

              {modTab === "moderators" && (
                <div className="space-y-5 max-w-[480px]">
                  <div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">現在のモデレーター</div>
                    {club.moderators.length === 0 ? (
                      <div className="text-xs text-[var(--color-mute)] py-3 text-center border border-dashed border-[var(--color-line)] rounded-xl">未設定</div>
                    ) : (
                      <div className="space-y-2">
                        {club.moderators.map(mod => (
                          <div key={mod.no} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-line)]">
                            <div>
                              <div className="font-display text-sm flex items-center gap-1.5">
                                {mod.name}
                                <span className="tag tag-accent text-[8px] !py-0">MOD</span>
                              </div>
                              <div className="num text-[10px] text-[var(--color-mute)]">#{mod.no} · {mod.since}〜</div>
                            </div>
                            <button onClick={() => removeModerator(club.id, mod.no)}
                              className="font-display text-[10px] px-2.5 py-1 rounded border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">
                              解除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">メンバーから追加</div>
                    <input
                      placeholder="氏名・会員番号で検索"
                      value={modSearch}
                      onChange={e => setModSearch(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-3 py-2 text-xs outline-none mb-2 placeholder-[var(--color-mute)] focus:border-[var(--color-accent)]/50"
                    />
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {filteredOptions.map(m => (
                        <button key={m.no} onClick={() => addModerator(club.id, m.no)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--color-accent)]/8 transition text-left border border-transparent hover:border-[var(--color-accent)]/30">
                          <div>
                            <div className="font-display text-sm">{m.name}</div>
                            <div className="num text-[10px] text-[var(--color-mute)]">#{m.no}</div>
                          </div>
                          <span className="font-display text-[10px] text-[var(--color-accent-deep)]">権限付与 →</span>
                        </button>
                      ))}
                      {filteredOptions.length === 0 && (
                        <div className="text-xs text-[var(--color-mute)] py-2 text-center">該当なし</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-line)]">
                    <p className="font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                      モデレーターはイベント作成・活動レポート投稿が可能になります
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCreate(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-6">クラブを作成</h2>
            <div className="space-y-4">
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">クラブ名</label>
                <input placeholder="例: 読書クラブ" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">説明</label>
                <textarea rows={3} placeholder="クラブの活動内容を入力" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none placeholder-[var(--color-mute)]" />
              </div>
              <ImageUpload label="クラブカバー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 btn-primary justify-center text-sm">作成する</button>
              <button onClick={() => setShowCreate(false)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
