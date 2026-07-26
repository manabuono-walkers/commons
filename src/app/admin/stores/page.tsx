"use client";
import { useState, useRef } from "react";
import ImageUpload from "@/components/ImageUpload";

// 店舗画像の複数枚アップロード（最大6枚）
function MultiImageUpload({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">店舗画像（複数枚登録可・最大6枚）</label>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--color-line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">×</button>
          </div>
        ))}
        {images.length < 6 && (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 transition"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-deep)", background: "rgba(184,152,90,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="font-display text-[10px]">{images.length}/6</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
        const files = Array.from(e.target.files ?? []).slice(0, 6 - images.length);
        const urls = files.map(f => URL.createObjectURL(f));
        onChange([...images, ...urls].slice(0, 6));
      }} />
    </div>
  );
}

type Scene = "デート" | "接待・ビジネス" | "女子会" | "二軒目" | "記念日" | "お一人様";
type TimeSlot = "ランチ" | "ディナー" | "深夜";
const GENRES = ["ワインバー", "バー", "カフェ", "レストラン", "アート", "コーヒー", "アートギャラリー"];
const SCENES: Scene[] = ["デート", "接待・ビジネス", "女子会", "二軒目", "記念日", "お一人様"];
const TIMES: TimeSlot[] = ["ランチ", "ディナー", "深夜"];

interface Store {
  id: string; name: string; area: string; station: string; address: string; coupons: number;
  genre: string; scenes: Scene[]; times: TimeSlot[];
  images: string[]; googleMapsUrl: string; snsUrl: string; intro: string;
}

const initialStores: Store[] = [
  { id:"howl", name:"SOUND BAR HOWL", area:"東京・渋谷", station:"渋谷駅", address:"東京都渋谷区道玄坂1-12-3", coupons:2, genre:"バー", scenes:["二軒目","お一人様"], times:["ディナー","深夜"], images: ["/images/bar.png"], googleMapsUrl: "https://maps.google.com/?q=SOUND+BAR+HOWL", snsUrl: "https://instagram.com/soundbarhowl", intro: "渋谷の隠れ家的ミュージックバー。DJイベントも定期開催。" },
  { id:"lacave", name:"La Cave", area:"東京・六本木", station:"六本木駅", address:"東京都港区六本木6-4-1", coupons:1, genre:"ワインバー", scenes:["デート","記念日","接待・ビジネス"], times:["ディナー","深夜"], images: ["/images/wine.png"], googleMapsUrl: "https://maps.google.com/?q=La+Cave", snsUrl: "", intro: "厳選ワインが揃うカーヴ。少人数のワイン会にも最適。" },
  { id:"coffee", name:"Coffee Commons", area:"東京・三軒茶屋", station:"三軒茶屋駅", address:"東京都世田谷区三軒茶屋1-32-14", coupons:1, genre:"カフェ", scenes:["お一人様","女子会"], times:["ランチ"], images: ["/images/cafe.png"], googleMapsUrl: "https://maps.google.com/?q=Coffee+Commons", snsUrl: "https://instagram.com/coffeecommons", intro: "スペシャルティコーヒー専門店。カッピングイベント会場としても人気。" },
  { id:"gallery", name:"Gallery LÚMEN", area:"東京・代官山", station:"代官山駅", address:"東京都渋谷区猿楽町18-8", coupons:0, genre:"アート", scenes:["デート","女子会"], times:["ランチ","ディナー"], images: [], googleMapsUrl: "", snsUrl: "", intro: "" },
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
  const [editStation, setEditStation] = useState("");
  const [editAddr, setEditAddr] = useState("");
  const [editGenre, setEditGenre] = useState(GENRES[0]);
  const [editScenes, setEditScenes] = useState<Scene[]>([]);
  const [editTimes, setEditTimes] = useState<TimeSlot[]>([]);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editMapsUrl, setEditMapsUrl] = useState("");
  const [editSnsUrl, setEditSnsUrl] = useState("");
  const [editIntro, setEditIntro] = useState("");
  const [newGenre, setNewGenre] = useState(GENRES[0]);
  const [newScenes, setNewScenes] = useState<Scene[]>([]);
  const [newTimes, setNewTimes] = useState<TimeSlot[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newMapsUrl, setNewMapsUrl] = useState("");
  const [newSnsUrl, setNewSnsUrl] = useState("");
  const [newIntro, setNewIntro] = useState("");
  const store = stores.find(s => s.id === selectedId);

  function toggle<T>(list: T[], v: T, set: (l: T[]) => void) {
    set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  }

  function deleteStore(id: string) {
    if (!confirm(`「${stores.find(s=>s.id===id)?.name}」を削除しますか？`)) return;
    setStores(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function select(id: string) { setSelectedId(id); setRightPanel("detail"); }

  function openEdit(s: Store) {
    setEditName(s.name); setEditArea(s.area); setEditStation(s.station); setEditAddr(s.address);
    setEditGenre(s.genre); setEditScenes(s.scenes); setEditTimes(s.times);
    setEditImages(s.images); setEditMapsUrl(s.googleMapsUrl); setEditSnsUrl(s.snsUrl);
    setEditIntro(s.intro);
    setRightPanel("edit");
  }

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
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="font-display text-xl">{store.name}</h2>
                  </div>
                  <div className="font-display text-sm text-[var(--color-mute)]">{store.area}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(store)} className="btn-outline !py-1.5 text-xs">編集</button>
                  <button onClick={() => deleteStore(store.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                </div>
              </div>

              {store.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {store.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[var(--color-line)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {store.intro && (
                <div className="card p-4 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1.5">店舗紹介</div>
                  <p className="text-sm text-[var(--color-mute)] leading-relaxed">{store.intro}</p>
                </div>
              )}

              {(store.googleMapsUrl || store.snsUrl) && (
                <div className="flex gap-2 mb-4">
                  {store.googleMapsUrl && (
                    <a href={store.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-[var(--color-line)] font-display text-xs text-[var(--color-mute)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent-deep)] transition">
                      Googleマップ ↗
                    </a>
                  )}
                  {store.snsUrl && (
                    <a href={store.snsUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-[var(--color-line)] font-display text-xs text-[var(--color-mute)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent-deep)] transition">
                      SNS ↗
                    </a>
                  )}
                </div>
              )}

              <div className="card overflow-hidden mb-4">
                {[
                  {l:"店舗名",v:store.name},
                  {l:"ジャンル",v:store.genre},
                  {l:"エリア",v:store.area},
                  {l:"最寄駅",v:store.station},
                  {l:"住所",v:store.address},
                  {l:"クーポン数",v:`${store.coupons}件`},
                ].map(r=>(
                  <div key={r.l} className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-line)] last:border-b-0">
                    <span className="font-display text-xs text-[var(--color-mute)]">{r.l}</span>
                    <span className="font-display text-sm">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mb-2">
                {store.scenes.map(sc => <span key={sc} className="tag text-[9px]">{sc}</span>)}
                {store.times.map(t => <span key={t} className="tag text-[9px] tag-ink">{t}</span>)}
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
                  {l:"最寄駅", v:editStation, set:setEditStation, ph:"例: 渋谷駅"},
                  {l:"住所", v:editAddr, set:setEditAddr, ph:"東京都渋谷区..."},
                ].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input value={f.v} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  </div>
                ))}

                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">ジャンル</label>
                  <select value={editGenre} onChange={e=>setEditGenre(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">利用シーン（複数選択可）</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SCENES.map(sc => (
                      <button key={sc} type="button" onClick={()=>toggle(editScenes, sc, setEditScenes)}
                        className={`font-display text-[11px] px-3 py-1.5 rounded-full border transition ${editScenes.includes(sc)?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">時間帯（複数選択可）</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIMES.map(t => (
                      <button key={t} type="button" onClick={()=>toggle(editTimes, t, setEditTimes)}
                        className={`font-display text-[11px] px-3 py-1.5 rounded-full border transition ${editTimes.includes(t)?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <MultiImageUpload images={editImages} onChange={setEditImages} />

                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">Googleマップ URL（任意）</label>
                  <input type="url" value={editMapsUrl} onChange={e=>setEditMapsUrl(e.target.value)} placeholder="https://maps.google.com/?q=..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">SNSリンク（任意）</label>
                  <input type="url" value={editSnsUrl} onChange={e=>setEditSnsUrl(e.target.value)} placeholder="https://instagram.com/..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">店舗紹介文</label>
                  <textarea value={editIntro} onChange={e=>setEditIntro(e.target.value)} rows={3} placeholder="店舗やサービスの紹介文を入力..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => {
                    setStores(prev => prev.map(s => s.id===store.id?{...s,name:editName,area:editArea,station:editStation,address:editAddr,genre:editGenre,scenes:editScenes,times:editTimes,images:editImages,googleMapsUrl:editMapsUrl,snsUrl:editSnsUrl,intro:editIntro}:s));
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
                  {l:"最寄駅", ph:"例: 渋谷駅"},
                  {l:"住所", ph:"東京都渋谷区..."},
                ].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input placeholder={f.ph} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  </div>
                ))}

                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">ジャンル</label>
                  <select value={newGenre} onChange={e=>setNewGenre(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">利用シーン（複数選択可）</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SCENES.map(sc => (
                      <button key={sc} type="button" onClick={()=>toggle(newScenes, sc, setNewScenes)}
                        className={`font-display text-[11px] px-3 py-1.5 rounded-full border transition ${newScenes.includes(sc)?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">時間帯（複数選択可）</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIMES.map(t => (
                      <button key={t} type="button" onClick={()=>toggle(newTimes, t, setNewTimes)}
                        className={`font-display text-[11px] px-3 py-1.5 rounded-full border transition ${newTimes.includes(t)?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <MultiImageUpload images={newImages} onChange={setNewImages} />

                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">Googleマップ URL（任意）</label>
                  <input type="url" value={newMapsUrl} onChange={e=>setNewMapsUrl(e.target.value)} placeholder="https://maps.google.com/?q=..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">SNSリンク（任意）</label>
                  <input type="url" value={newSnsUrl} onChange={e=>setNewSnsUrl(e.target.value)} placeholder="https://instagram.com/..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">店舗紹介文</label>
                  <textarea value={newIntro} onChange={e=>setNewIntro(e.target.value)} rows={3} placeholder="店舗やサービスの紹介文を入力..."
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                </div>
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
