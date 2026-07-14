"use client";
import { useState } from "react";

interface Admin { name: string; email: string; role: string; joined: string; }

const initialAdmins: Admin[] = [
  { name: "中島 誉", email: "nakajima@walker-s.co.jp", role: "スーパー管理者", joined: "2025.01.01" },
  { name: "田中 太郎", email: "tanaka@walker-s.co.jp", role: "管理者", joined: "2025.03.15" },
];

export default function SettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"管理者"|"スーパー管理者">("管理者");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!newEmail || !newPassword || !newName) return;
    setAdmins(prev => [...prev, { name: newName, email: newEmail, role: newRole, joined: "2026.07.12" }]);
    setNewEmail(""); setNewPassword(""); setNewName(""); setAdded(true);
    setTimeout(() => { setAdded(false); setShowAddPanel(false); }, 1200);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">SETTINGS</div>
        <h1 className="font-display text-2xl mt-0.5">管理者設定</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main admin list */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-[700px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-base">管理者アカウント</h2>
              <button onClick={() => { setShowAddPanel(true); setAdded(false); }} className="btn-primary !py-2 text-xs">＋ 管理者を追加</button>
            </div>
            <div className="space-y-3">
              {admins.map(a => (
                <div key={a.email} className="card p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center font-display text-base text-[var(--color-accent-deep)]">{a.name[0]}</div>
                    <div>
                      <div className="font-display text-sm">{a.name}</div>
                      <div className="font-display text-xs text-[var(--color-mute)]">{a.email}</div>
                      <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">登録日: {a.joined}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tag text-[9px] tag-ink">{a.role}</span>
                    <button className="btn-outline !py-1.5 text-xs">編集</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add admin sub-panel */}
        {showAddPanel && (
          <div className="w-[360px] border-l border-[var(--color-line)] flex flex-col bg-[var(--color-bg-soft)] flex-none">
            <div className="px-6 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
              <h2 className="font-display text-base">管理者を追加</h2>
              <button onClick={() => setShowAddPanel(false)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {added && (
                <div className="px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 font-display text-xs text-[var(--color-accent-deep)]">
                  ✓ 管理者を追加しました
                </div>
              )}
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">氏名</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="例: 山田 花子"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">メールアドレス</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="example@walker-s.co.jp"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">パスワード</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8文字以上"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                <p className="font-display text-[10px] text-[var(--color-mute)] mt-1">8文字以上、英数字を含む</p>
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">権限</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as "管理者"|"スーパー管理者")}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                  <option value="管理者">管理者</option>
                  <option value="スーパー管理者">スーパー管理者</option>
                </select>
              </div>
              <div className="pt-2">
                <button onClick={handleAdd} disabled={!newEmail || !newPassword || !newName}
                  className="w-full btn-primary justify-center text-sm disabled:opacity-40">追加する</button>
                <button onClick={() => setShowAddPanel(false)} className="w-full btn-outline justify-center text-sm mt-3">キャンセル</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
