"use client";
import { useState } from "react";

type Role = "管理者" | "副管理者" | "運用者";
const AREAS = ["すべて", "東京", "大阪", "福岡"] as const;
type Area = (typeof AREAS)[number];

const FEATURES = [
  "分析・BI", "会員管理", "審査管理", "売上管理", "イベント管理",
  "通知・配信", "コンテンツ管理", "クラブ管理", "クーポン管理", "提携店舗", "意見箱", "管理者設定",
] as const;
type Feature = (typeof FEATURES)[number];

// 権限区分ごとのデフォルト利用不可機能
const ROLE_DEFAULT_RESTRICTED: Record<Role, Feature[]> = {
  "管理者": [],
  "副管理者": ["管理者設定"],
  "運用者": ["管理者設定", "売上管理", "クラブ管理", "クーポン管理", "審査管理"],
};

interface Admin {
  name: string; email: string; role: Role; joined: string;
  area: Area; restricted: Feature[];
}

const initialAdmins: Admin[] = [
  { name: "中島 誉", email: "nakajima@walker-s.co.jp", role: "管理者", joined: "2025.01.01", area: "すべて", restricted: [] },
  { name: "田中 太郎", email: "tanaka@walker-s.co.jp", role: "副管理者", joined: "2025.03.15", area: "東京", restricted: ROLE_DEFAULT_RESTRICTED["副管理者"] },
  { name: "森田 桂", email: "morita@walker-s.co.jp", role: "運用者", joined: "2026.02.01", area: "大阪", restricted: ROLE_DEFAULT_RESTRICTED["運用者"] },
];

export default function SettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("管理者");
  const [newArea, setNewArea] = useState<Area>("すべて");
  const [newRestricted, setNewRestricted] = useState<Feature[]>([]);
  const [added, setAdded] = useState(false);

  function changeRole(role: Role) {
    setNewRole(role);
    setNewRestricted(ROLE_DEFAULT_RESTRICTED[role]); // デフォルトの制限を適用（個別にカスタマイズ可能）
  }

  function toggleRestricted(feature: Feature) {
    setNewRestricted(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  }

  function handleAdd() {
    if (!newEmail || !newPassword || !newName) return;
    setAdmins(prev => [...prev, { name: newName, email: newEmail, role: newRole, joined: "2026.07.12", area: newArea, restricted: newRestricted }]);
    setNewEmail(""); setNewPassword(""); setNewName(""); setNewRole("管理者"); setNewArea("すべて"); setNewRestricted([]);
    setAdded(true);
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
          <div className="max-w-[760px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-base">管理者アカウント</h2>
              <button onClick={() => { setShowAddPanel(true); setAdded(false); }} className="btn-primary !py-2 text-xs">＋ 管理者を追加</button>
            </div>
            <div className="space-y-3">
              {admins.map(a => (
                <div key={a.email} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center font-display text-base text-[var(--color-accent-deep)]">{a.name[0]}</div>
                      <div>
                        <div className="font-display text-sm">{a.name}</div>
                        <div className="font-display text-xs text-[var(--color-mute)]">{a.email}</div>
                        <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">登録日: {a.joined}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tag text-[9px]">担当: {a.area}</span>
                      <span className="tag text-[9px] tag-ink">{a.role}</span>
                      <button className="btn-outline !py-1.5 text-xs">編集</button>
                    </div>
                  </div>
                  {a.restricted.length > 0 && (
                    <div className="pt-3 border-t border-[var(--color-line)] flex items-center gap-2 flex-wrap">
                      <span className="font-display text-[10px] text-[var(--color-mute)]">利用不可:</span>
                      {a.restricted.map(f => (
                        <span key={f} className="font-display text-[9px] px-2 py-0.5 rounded-full border border-red-400/30 text-red-400">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add admin sub-panel */}
        {showAddPanel && (
          <div className="w-[400px] border-l border-[var(--color-line)] flex flex-col bg-[var(--color-bg-soft)] flex-none">
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
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">担当エリア</label>
                <select value={newArea} onChange={e => setNewArea(e.target.value as Area)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <p className="font-display text-[10px] text-[var(--color-mute)] mt-1">「すべて」以外を選ぶと、担当エリアのデータのみ操作できます</p>
              </div>

              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">権限</label>
                <select value={newRole} onChange={e => changeRole(e.target.value as Role)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                  <option value="管理者">管理者</option>
                  <option value="副管理者">副管理者</option>
                  <option value="運用者">運用者</option>
                </select>
              </div>

              <div>
                <div className="font-display text-xs text-[var(--color-mute)] mb-2">利用できない機能（権限選択でデフォルト設定・個別変更可）</div>
                <div className="space-y-1.5">
                  {FEATURES.map(f => (
                    <label key={f} className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-[var(--color-bg)] transition">
                      <input type="checkbox" checked={newRestricted.includes(f)} onChange={() => toggleRestricted(f)} className="accent-red-400" />
                      <span className="font-display text-xs">{f}</span>
                    </label>
                  ))}
                </div>
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
