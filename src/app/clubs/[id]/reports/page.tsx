import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

const allReports: Record<string, { id: number; title: string; date: string; body: string; images: number }[]> = {
  wine: [
    { id: 1, title: "ブルゴーニュナイト Vol.12 レポート", date: "2026.06.02", body: "12名が参加し、ポマール・ジュブレシャンベルタン・モレサンドニの3種を縦飲み。大盛況でした。", images: 6 },
    { id: 2, title: "春のロゼワイン会", date: "2026.04.20", body: "プロヴァンスのロゼを中心に5種をテイスティング。次回はスパークリングを加える案が出ました。", images: 4 },
    { id: 3, title: "ニューワールドワイン入門会", date: "2026.03.08", body: "チリ・アルゼンチン・南アフリカの3カ国をテーマに開催。コスパの高さに驚く声が多数。", images: 5 },
    { id: 4, title: "年末ワインガラ 2025", date: "2025.12.20", body: "年末特別企画として20名が参加。シャンパーニュ・ブルゴーニュ・ボルドーを飲み比べした豪華な回でした。", images: 10 },
  ],
  coffee: [
    { id: 1, title: "エチオピア×コロンビア飲み比べ", date: "2026.06.14", body: "シングルオリジン2種を丁寧にカッピング。風味の違いを体感できる充実した回でした。", images: 3 },
    { id: 2, title: "スペシャルティコーヒー基礎講座", date: "2026.04.05", body: "精製プロセス（ウォッシュド/ナチュラル/ハニー）について学ぶ座学＋実践の回。", images: 2 },
  ],
  travel: [
    { id: 1, title: "春の京都旅レポート", date: "2026.04.05", body: "祇園・東山エリアを中心に、隠れ家的なお店を6軒巡りました。写真80枚のアルバムを共有中。", images: 12 },
    { id: 2, title: "冬の箱根温泉旅", date: "2025.12.15", body: "4名で箱根へ。宿のチョイスから食事まで全てCOMMONSメンバーのおすすめで巡りました。", images: 8 },
  ],
};

const clubNames: Record<string, string> = {
  wine: "ワイン部",
  coffee: "コーヒー部",
  travel: "旅部",
};

export default function ClubReportsPage({ params }: { params: { id: string } }) {
  const reports = allReports[params.id] ?? allReports.wine;
  const clubName = clubNames[params.id] ?? "クラブ";

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${params.id}`} />
        <div className="px-5 pt-6 pb-4 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">{clubName}</p>
          <h1 className="font-display text-2xl">活動レポート</h1>
        </div>
        <div className="px-5 pt-5 space-y-4">
          {reports.map(r => (
            <div key={r.id} className="card p-5">
              <div className="font-display text-xs text-[var(--color-mute)] mb-2">{r.date}</div>
              <h3 className="font-display text-lg">{r.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-mute)] leading-relaxed">{r.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: Math.min(r.images, 4) }).map((_, i) => (
                  <div key={i} className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">📷</div>
                ))}
                {r.images > 4 && (
                  <div className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">+{r.images - 4}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
