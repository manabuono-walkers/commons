"use client";
import { useState } from "react";
import TargetCondition from "@/components/TargetCondition";

interface Coupon {
  id: string; name: string; store: string;
  uses: number; active: boolean;
  usageHistory: { user: string; date: string }[];
}

const initialCoupons: Coupon[] = [
  { id: "C001", name: "SOUND BAR HOWLドリンク1杯無料", store: "SOUND BAR HOWL", uses: 38, active: true, usageHistory: [{ user: "佐藤 美咲 #0827", date: "2026.07.08" }, { user: "青山 陸 #0824", date: "2026.07.06" }, { user: "田中 康介 #0880", date: "2026.07.05" }] },
  { id: "C002", name: "La Cave ワイン1本10%OFF", store: "La Cave", uses: 12, active: true, usageHistory: [{ user: "山本 彩花 #0885", date: "2026.07.07" }, { user: "森田 桂 #0851", date: "2026.07.03" }] },
  { id: "C003", name: "Coffee Commons ドリップコーヒー無料", store: "Coffee Commons", uses: 71, active: true, usageHistory: [{ user: "村瀬 史奈 #0873", date: "2026.07.09" }, { user: "田中 康介 #0880", date: "2026.07.08" }, { user: "佐藤 美咲 #0827", date: "2026.07.07" }] },
  { id: "C004", name: "初回入会月会費無料（新規限定）", store: "システム", uses: 23, active: true, usageHistory: [{ user: "橋本 涼 #0868", date: "2026.07.05" }] },
  { id: "C005", name: "夏祭りスペシャルクーポン", store: "全店舗", uses: 0, active: false, usageHistory: [] },
];

type ModalType = "create" | "edit" | "history" | null;
type PageTab = "list" | "usage";

function SubModal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className={`bg-[var(--color-bg-soft)] rounded-2xl p-8 ${wide ? "w-[640px]" : "w-[560px]"} max-h-[85vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl">{title}</h2>
          <button onClick={onClose} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CouponForm({ initial, onSave, onCancel }: { initial?: Partial<Coupon>; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="space-y-4">
      {[
        { l: "クーポン名", ph: initial?.name ?? "例: ドリンク1杯無料" },
        { l: "提携店舗", ph: initial?.store ?? "店舗名またはシステム" },
      ].map(f => (
        <div key={f.l}>
          <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
          <input defaultValue={f.ph} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
        </div>
      ))}
      <div>
        <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">ステータス</label>
        <select defaultValue={initial?.active ? "有効" : "無効"} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
          <option value="有効">有効</option>
          <option value="無効">無効</option>
        </select>
      </div>
      <TargetCondition label="配布対象" />
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} className="flex-1 btn-primary justify-center text-sm">保存する</button>
        <button onClick={onCancel} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [modal, setModal] = useState<ModalType>(null);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [historyTarget, setHistoryTarget] = useState<Coupon | null>(null);
  const [pageTab, setPageTab] = useState<PageTab>("list");

  function toggleActive(id: string) {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  function deleteCoupon(id: string) {
    if (!confirm("このクーポンを削除しますか？")) return;
    setCoupons(prev => prev.filter(c => c.id !== id));
  }

  function closeModal() { setModal(null); setEditTarget(null); setHistoryTarget(null); }

  const allUsage = coupons.flatMap(c => c.usageHistory.map(h => ({ ...h, couponName: c.name, couponId: c.id })));
  const [uDateFrom, setUDateFrom] = useState("");
  const [uDateTo, setUDateTo] = useState("");
  const [uCouponQ, setUCouponQ] = useState("");
  const [uUserQ, setUUserQ] = useState("");

  const filteredUsage = allUsage.filter(h => {
    if (uDateFrom && h.date < uDateFrom.replace(/-/g,".")) return false;
    if (uDateTo && h.date > uDateTo.replace(/-/g,".")) return false;
    if (uCouponQ && !h.couponName.includes(uCouponQ)) return false;
    if (uUserQ && !h.user.includes(uUserQ)) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">COUPON</div>
          <h1 className="font-display text-2xl mt-0.5">クーポン管理</h1>
        </div>
        {pageTab === "list" && (
          <button onClick={() => setModal("create")} className="btn-primary !py-2 text-xs">＋ クーポン作成</button>
        )}
      </div>

      {/* Inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {(["list", "usage"] as const).map(t => (
          <button key={t} onClick={() => setPageTab(t)}
            className={`font-display text-sm py-4 border-b-2 transition ${pageTab === t ? "border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-transparent text-[var(--color-mute)]"}`}>
            {t === "list" ? "クーポン一覧" : "クーポン利用一覧"}
          </button>
        ))}
      </div>

      {pageTab === "list" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-3 max-w-[900px]">
            {coupons.map(c => (
              <div key={c.id} className="card overflow-hidden">
                <div className="p-5 flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-display text-xs font-medium ${c.active ? "text-green-400" : "text-red-400"}`}>{c.active ? "有効" : "無効"}</span>
                    </div>
                    <h3 className="font-display text-base">{c.name}</h3>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">{c.store}</div>
                  </div>
                  <div className="flex gap-2 flex-none items-center">
                    <span className="num text-xs text-[var(--color-mute)]">利用 {c.uses}回</span>
                    <button onClick={() => { setHistoryTarget(c); setModal("history"); }}
                      className="font-display text-xs px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
                      利用履歴
                    </button>
                    <button onClick={() => { setEditTarget(c); setModal("edit"); }} className="btn-outline !py-1.5 text-xs">編集</button>
                    <button onClick={() => toggleActive(c.id)}
                      className={`font-display text-xs px-3 py-1.5 rounded-full border transition ${c.active ? "border-red-400/40 text-red-400 hover:bg-red-400/8" : "border-green-500/40 text-green-400 hover:bg-green-500/8"}`}>
                      {c.active ? "無効化" : "有効化"}
                    </button>
                    <button onClick={() => deleteCoupon(c.id)}
                      className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pageTab === "usage" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[860px]">
            {/* Search */}
            <div className="card p-4 mb-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">期間</span>
                <input type="date" value={uDateFrom} onChange={e=>setUDateFrom(e.target.value)}
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50" />
                <span className="font-display text-[10px] text-[var(--color-mute)]">〜</span>
                <input type="date" value={uDateTo} onChange={e=>setUDateTo(e.target.value)}
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50" />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">クーポン</span>
                <input value={uCouponQ} onChange={e=>setUCouponQ(e.target.value)} placeholder="クーポン名で検索"
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] flex-1" />
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">使用者</span>
                <input value={uUserQ} onChange={e=>setUUserQ(e.target.value)} placeholder="氏名・会員番号で検索"
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] flex-1" />
              </div>
            </div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-3">{filteredUsage.length}件</div>
            {filteredUsage.length > 0 ? (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-6 py-3">使用者</th>
                      <th className="px-6 py-3">クーポン</th>
                      <th className="px-6 py-3">使用日時</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {filteredUsage.map((h, i) => (
                      <tr key={i} className="hover:bg-[var(--color-bg-soft)] transition">
                        <td className="px-6 py-3 font-display">{h.user}</td>
                        <td className="px-6 py-3 font-display text-xs text-[var(--color-mute)]">{h.couponName}</td>
                        <td className="px-6 py-3 num text-xs text-[var(--color-mute)]">{h.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--color-mute)] font-display text-sm">該当する利用履歴がありません</div>
            )}
          </div>
        </div>
      )}

      {modal === "create" && (
        <SubModal title="クーポン作成" onClose={closeModal}>
          <CouponForm onSave={closeModal} onCancel={closeModal} />
        </SubModal>
      )}

      {modal === "edit" && editTarget && (
        <SubModal title="クーポン編集" onClose={closeModal}>
          <CouponForm initial={editTarget} onSave={closeModal} onCancel={closeModal} />
        </SubModal>
      )}

      {modal === "history" && historyTarget && (
        <SubModal title={`利用履歴 — ${historyTarget.name}`} onClose={closeModal} wide>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-display text-sm">{historyTarget.name}</span>
            <span className="num text-xs text-[var(--color-mute)]">合計 {historyTarget.uses}回</span>
          </div>
          {historyTarget.usageHistory.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                  <th className="pb-3 pr-6">会員</th>
                  <th className="pb-3">利用日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {historyTarget.usageHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-[var(--color-bg)] transition">
                    <td className="py-3 pr-6 font-display">{h.user}</td>
                    <td className="py-3 num text-xs text-[var(--color-mute)]">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-[var(--color-mute)] font-display text-sm">利用履歴がありません</div>
          )}
          <button onClick={closeModal} className="mt-6 w-full btn-outline justify-center text-sm">閉じる</button>
        </SubModal>
      )}
    </div>
  );
}
