"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Store { id: string; name: string; area: string; address: string; coupons: number; }

const initialStores: Store[] = [
  { id:"howl", name:"SOUND BAR HOWL", area:"東京・渋谷", address:"東京都渋谷区道玄坂1-12-3", coupons:2 },
  { id:"lacave", name:"La Cave", area:"東京・六本木", address:"東京都港区六本木6-4-1", coupons:1 },
  { id:"coffee", name:"Coffee Commons", area:"東京・三軒茶屋", address:"東京都世田谷区三軒茶屋1-32-14", coupons:1 },
  { id:"gallery", name:"Gallery LÚMEN", area:"東京・代官山", address:"東京都渋谷区猿楽町18-8", coupons:0 },
];

type RightPanel = "detail" | "edit" | "create";

// Dummy cover colors per store for visual variety
const storeBg: Record<string, string> = {
  howl: "from-indigo-900/40 to-slate-900/60",
  lacave: "from-purple-900/40 to-slate-900/60",
  coffee: "from-amber-900/40 to-stone-900/60",
  gallery: "from-zinc-800/40 to-slate-900/60",
};

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>("detail");
  const [editName, setEditName] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editAddr, setEditAddr] = useState("");
  const store = stores.find(s => s.id === selectedId);

  function deleteStore(id: string) {
    if (!confirm(`「${stores.find(s=>s.id===id)?.name}」を削除しますか？`)) return;
    setStores(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function select(id: string) { setSelectedId(id); setRightPanel("detail"); }

  function openEdit(s: Store) { setEditName(s.name); setEditArea(s.area); setEditAddr(s.address); setRightPanel("edit"); }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">STORE</div>
          <h1 className="font-display text-2xl mt-0.5">提携店舗管理</h1>
        </div>
        <button onClick={() => { setSelectedId(null); setRightPanel("create"); }} className="btn-primary !py-2 text-xs">＋ 店舗追加</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left list */}
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {stores.map(s => (
            <div key={s.id} onClick={() => select(s.id)}
              className={`px-6 py-4 cursor-pointer transition hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] border-l-2 ${selectedId===s.id?"bg-[var(--color-accent)]/8 border-l-[var(--color-accent)]":"border-l-transparent"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center font-display text-sm text-[var(--color-accent-deep)] flex-none">{s.name[0]}</div>
                <div className="min-w-0">
                  <div className="font-display text-sm truncate">{s.name}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)]">{s.area}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)]">クーポン {s.coupons}件</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)]">
          {/* Empty state */}
          {!selectedId && rightPanel !== "create" && (
            <div className="flex items-center justify-center h-full text-[var(--color-mute)] font-display text-sm">
              店舗を選択してください
            </div>
          )}

          {/* Detail */}
          {selectedId && store && rightPanel === "detail" && (
            <div className="px-8 py-6 max-w-[560px]">
              {/* Cover image placeholder */}
              <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${storeBg[store.id]??"from-zinc-800/40 to-slate-900/60"} mb-6 flex items-end p-5`}>
                <div>
                  <div className="font-display text-xl text-white/90 mb-0.5">{store.name}</div>
                  <div className="font-display text-xs text-white/50">{store.area}</div>
                </div>
              </div>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl mb-0.5">{store.name}</h2>
                  <div className="font-display text-sm text-[var(--color-mute)]">{store.area}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(store)} className="btn-outline !py-1.5 text-xs">編集</button>
                  <button onClick={() => deleteStore(store.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                </div>
              </div>
              <div className="card overflow-hidden">
                {[
                  {l:"店舗名",v:store.name},
                  {l:"エリア",v:store.area},
                  {l:"住所",v:store.address},
                  {l:"クーポン数",v:`${store.coupons}件`},
                ].map(r=>(
                  <div key={r.l} className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-line)] last:border-b-0">
                    <span className="font-display text-xs text-[var(--color-mute)]">{r.l}</span>
                    <span className="font-display text-sm">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit */}
          {selectedId && store && rightPanel === "edit" && (
            <div className="px-8 py-6 max-w-[560px]">
              <button onClick={() => setRightPanel("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-4">← 戻る</button>
              <h2 className="font-display text-xl mb-5">店舗を編集: {store.name}</h2>

              {/* Current cover image preview */}
              <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${storeBg[store.id]??"from-zinc-800/40 to-slate-900/60"} mb-4 flex items-end p-4`}>
                <span className="font-display text-sm text-white/80">{store.name}</span>
              </div>
              <ImageUpload label="カバー画像を変更" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />

              <div className="space-y-4 mt-4">
                {[
                  {l:"店舗名", v:editName, set:setEditName, ph:"例: SOUND BAR HOWL"},
                  {l:"エリア", v:editArea, set:setEditArea, ph:"例: 東京・渋谷"},
                  {l:"住所", v:editAddr, set:setEditAddr, ph:"東京都渋谷区..."},
                ].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input value={f.v} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => {
                    setStores(prev => prev.map(s => s.id===store.id?{...s,name:editName,area:editArea,address:editAddr}:s));
                    setRightPanel("detail");
                  }} className="flex-1 btn-primary justify-center text-sm">保存する</button>
                  <button onClick={() => setRightPanel("detail")} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
                </div>
              </div>
            </div>
          )}

          {/* Create */}
          {rightPanel === "create" && (
            <div className="px-8 py-6 max-w-[560px]">
              <h2 className="font-display text-xl mb-5">店舗を追加</h2>
              <ImageUpload label="カバー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
              <div className="space-y-4 mt-4">
                {[
                  {l:"店舗名", ph:"例: SOUND BAR HOWL"},
                  {l:"エリア", ph:"例: 東京・渋谷"},
                  {l:"住所", ph:"東京都渋谷区..."},
                ].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input placeholder={f.ph} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 btn-primary justify-center text-sm">追加する</button>
                  <button onClick={() => setSelectedId(null)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
