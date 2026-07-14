"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const stores = [
  { id: 1, name: "La Cave",        area: "麻布十番", cat: "ワインバー",      image: "/images/bar.png",     address: "港区麻布十番2-5-6 B1F", hours: "18:00〜25:00（日曜定休）", benefit: "ワイン1杯無料",     benefitDetail: "ご来店時に会員証を提示で、グラスワイン1杯をサービス", discount: "10%OFF",      active: true },
  { id: 2, name: "Coffee Commons", area: "代官山",   cat: "コーヒー",        image: "/images/cafe.png",    address: "渋谷区猿楽町17-8",      hours: "08:00〜20:00（無休）",    benefit: "コーヒー1杯無料",  benefitDetail: "毎月1回、任意のドリンク1杯無料",                     discount: "10%OFF",      active: true },
  { id: 3, name: "Gallery AXIS",   area: "六本木",   cat: "アートギャラリー", image: "/images/gallery.png", address: "港区六本木5-17-1",       hours: "11:00〜20:00（月曜定休）", benefit: "入場料無料",        benefitDetail: "企画展・常設展ともに入場無料",                       discount: "—",           active: true },
  { id: 4, name: "Cask",           area: "西麻布",   cat: "ウイスキーバー",   image: "/images/wine.png",    address: "港区西麻布2-12-4",       hours: "19:00〜27:00（日月定休）", benefit: "ウイスキー1杯無料", benefitDetail: "スタンダードクラスのウイスキー1杯をサービス",         discount: "15%OFF",      active: false },
  { id: 5, name: "The Library",    area: "渋谷",     cat: "バー",            image: "/images/wisky.png",   address: "渋谷区道玄坂1-22-7 2F", hours: "17:00〜26:00（月曜定休）", benefit: "入店料無料",        benefitDetail: "通常¥1,500の入店料が無料",                           discount: "飲み物20%OFF", active: true },
];

const coupons = [
  { id: 1, store: "La Cave",        title: "ワイン1杯無料クーポン",   until: "2026.06.30", code: "WINE-0824", used: false },
  { id: 2, store: "Coffee Commons", title: "ドリンク1杯無料クーポン", until: "2026.07.15", code: "CAFE-0824", used: false },
  { id: 3, store: "The Library",    title: "入店料無料クーポン",      until: "2026.08.31", code: "LIB-0824",  used: true },
];

function StoresContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"map" | "coupons">(
    searchParams.get("tab") === "coupons" ? "coupons" : "map"
  );
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-line)]">
          {(["map", "coupons"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 font-display text-xs tracking-[0.06em] transition ${tab === t ? "border-b-2 text-[var(--color-accent-deep)]" : "text-[var(--color-mute)]"}`}
              style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}
            >
              {t === "map" ? "店舗一覧" : `クーポン（${coupons.filter(c => !c.used).length}枚）`}
            </button>
          ))}
        </div>

        {tab === "map" && (
          <div className="px-5 pt-5 space-y-3">
            {stores.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id === selected ? null : s.id)}
                className={`w-full text-left card overflow-hidden transition-all ${selected === s.id ? "border-[var(--color-accent)]" : ""}`}
              >
                <div className="h-[120px] bg-cover bg-center relative" style={{ backgroundImage: `url(${s.image})` }}>
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-display text-base text-white">{s.name}</div>
                    <div className="font-display text-[10px] text-white/70 mt-0.5">{s.cat} · {s.area}{!s.active && " · 一時休業"}</div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="font-display text-[10px] border border-[var(--color-accent)]/70 text-[var(--color-accent-deep)] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-wide">{s.benefit}</span>
                  </div>
                </div>

                {selected === s.id && (
                  <div className="p-4 space-y-2 text-xs border-t border-[var(--color-line)]">
                    <div className="flex gap-2"><span className="text-[var(--color-mute)] w-16">住所</span><span className="flex-1">{s.address}</span></div>
                    <div className="flex gap-2"><span className="text-[var(--color-mute)] w-16">営業時間</span><span className="flex-1">{s.hours}</span></div>
                    <div className="mt-3 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-accent)]/30">
                      <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">会員特典</div>
                      <div>{s.benefitDetail}</div>
                      <div className="text-[var(--color-mute)] mt-1">その他: {s.discount}</div>
                    </div>
                    {/* Map image */}
                    <div className="rounded-xl overflow-hidden border border-[var(--color-line)] mt-2" style={{ height: 130 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/Googlemap.png" alt="MAP" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {tab === "coupons" && (
          <div className="px-5 pt-5 space-y-4">
            <div className="font-display text-[10px] tracking-[0.06em] text-[var(--color-mute)]">利用可能 {coupons.filter(c => !c.used).length}枚 · 使用済 {coupons.filter(c => c.used).length}枚</div>
            {coupons.map(c => (
              <div key={c.id} className={`card p-5 ${c.used ? "opacity-50" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-display text-[10px] tracking-[0.06em] text-[var(--color-mute)]">{c.store}</div>
                    <h3 className="font-display text-base mt-1">{c.title}</h3>
                  </div>
                  <span className={`tag ${c.used ? "" : "tag-accent"}`}>{c.used ? "使用済" : "利用可"}</span>
                </div>
                <div className="border border-dashed border-[var(--color-line)] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-[10px] tracking-[0.06em] text-[var(--color-mute)]">クーポンコード</div>
                    <div className="num text-xl tracking-widest mt-1">{c.code}</div>
                  </div>
                  {!c.used && (
                    <Link
                      href="/coupon-use"
                      className="font-display text-xs px-4 py-2 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition flex items-center gap-1.5 tracking-wide"
                    >
                      提示する
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  )}
                </div>
                <div className="mt-3 font-display text-[10px] tracking-[0.04em] text-[var(--color-mute)]">有効期限: {c.until}</div>
              </div>
            ))}
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense>
      <StoresContent />
    </Suspense>
  );
}
