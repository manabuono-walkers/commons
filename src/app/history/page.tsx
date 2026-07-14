"use client";
import { useRouter } from "next/navigation";

const history = [
  { date: "2026.07.01", type: "お支払い", desc: "月額会費（年間プラン）", pt: "+5",    amount: "¥500" },
  { date: "2026.06.02", type: "イベント", desc: "ワインサロン Vol.12",    pt: "+120",  amount: "" },
  { date: "2026.05.18", type: "イベント", desc: "Whisky Night Vol.7",    pt: "+120",  amount: "" },
  { date: "2026.05.12", type: "クーポン", desc: "La Cave 10% OFF 利用",  pt: "—",     amount: "-¥800" },
  { date: "2026.05.10", type: "イベント", desc: "Sunday Coffee Cupping #6", pt: "+80", amount: "" },
  { date: "2026.05.01", type: "お支払い", desc: "月額会費（年間プラン）", pt: "+5",    amount: "¥500" },
  { date: "2026.04.20", type: "イベント", desc: "春のロゼワイン会",       pt: "+100",  amount: "" },
  { date: "2026.04.05", type: "イベント", desc: "谷中フォトウォーク",      pt: "+80",   amount: "" },
  { date: "2026.04.01", type: "お支払い", desc: "月額会費（年間プラン）", pt: "+5",    amount: "¥500" },
  { date: "2026.03.15", type: "ポイント", desc: "友人招待ボーナス",        pt: "+500",  amount: "" },
  { date: "2026.03.10", type: "イベント", desc: "COMMONS MUSIC BAR Vol.2", pt: "+120", amount: "" },
  { date: "2026.03.01", type: "お支払い", desc: "月額会費（年間プラン）", pt: "+5",    amount: "¥500" },
];

const typeColor: Record<string, string> = {
  "イベント": "var(--color-accent-deep)",
  "ポイント": "#5B9BD5",
  "クーポン": "#8B6FD0",
  "お支払い": "var(--color-mute)",
};

export default function HistoryPage() {
  const router = useRouter();
  const totalPt = history.reduce((sum, h) => {
    const n = parseInt(h.pt.replace(/[^0-9]/g, ""));
    return h.pt.startsWith("+") ? sum + n : sum;
  }, 0);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-16">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            <div className="w-14" />
          </div>
        </header>

        <div className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">My Record</p>
            <h1 className="font-display text-2xl">参加・ポイント履歴</h1>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "合計獲得PT", val: totalPt.toLocaleString(), unit: "pt", highlight: true },
              { label: "イベント参加", val: "15", unit: "回" },
              { label: "入会", val: "8", unit: "ヶ月目" },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className="font-display text-[10px] text-[var(--color-mute)]">{s.label}</div>
                <div className={`mt-2 num text-xl ${s.highlight ? "text-[var(--color-accent-deep)]" : ""}`}>
                  {s.val}<span className="text-xs text-[var(--color-mute)] ml-0.5">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* History list */}
          <div className="card overflow-hidden">
            {history.map((h, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? "border-t border-[var(--color-line)]" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="font-display text-[9px] px-2 py-0.5 rounded-full border"
                      style={{ color: typeColor[h.type] ?? "var(--color-mute)", borderColor: typeColor[h.type] ?? "var(--color-line)" }}
                    >
                      {h.type}
                    </span>
                    <span className="font-display text-[10px] text-[var(--color-mute)]">{h.date}</span>
                  </div>
                  <div className="font-display text-sm">{h.desc}</div>
                  {h.amount && <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">{h.amount}</div>}
                </div>
                <div
                  className="num text-sm font-semibold flex-none"
                  style={{ color: h.pt.startsWith("+") ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                >
                  {h.pt}<span className="text-[10px] ml-0.5">pt</span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-display text-[10px] text-[var(--color-mute)] text-center pb-4">
            ※ 表示は直近12ヶ月分です
          </p>
        </div>
      </div>
    </div>
  );
}
