"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { getReport, getReports, getClubName } from "../reportData";

export default function ClubReportArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const reportIdRaw = Array.isArray(params.reportId) ? params.reportId[0] : (params.reportId ?? "");

  const clubName = getClubName(id);
  const report = getReport(id, Number(reportIdRaw));
  const reports = getReports(id);

  if (!report) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24">
          <AppHeader backHref={`/clubs/${id}/reports`} />
          <div className="px-5 py-16 text-center">
            <p className="font-display text-sm text-[var(--color-mute)]">レポートが見つかりませんでした。</p>
            <Link href={`/clubs/${id}/reports`} className="btn-outline !py-2.5 text-xs mt-6 inline-flex">
              活動レポート一覧へ
            </Link>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  const currentIndex = reports.findIndex(r => r.id === report.id);
  const nextReport = currentIndex >= 0 ? reports[currentIndex + 1] : undefined;

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${id}/reports`} />

        {/* 記事ヘッダー */}
        <article className="px-5 pt-6">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">
            {clubName}・活動レポート
          </p>
          <h1 className="text-xl leading-snug" style={{ fontFamily: "var(--font-mincho)" }}>
            {report.title}
          </h1>
          <div className="font-display text-xs text-[var(--color-mute)] mt-2.5">{report.date}</div>

          {/* メイン写真 */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-[var(--color-line)]">
            <div className="h-[180px] bg-[var(--color-line)] flex items-center justify-center text-3xl">📷</div>
          </div>

          {/* 本文 */}
          <div className="mt-6 space-y-4">
            {report.article.map((para, i) => (
              <p key={i} className="text-sm text-[var(--color-ink-soft)] leading-[1.9]">{para}</p>
            ))}
          </div>

          {/* 当日の写真 */}
          {report.images > 1 && (
            <div className="mt-8">
              <div className="font-display text-xs text-[var(--color-mute)] mb-3">
                当日の写真（<span className="num">{report.images}</span>枚）
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: Math.min(report.images - 1, 9) }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-[var(--color-line)] flex items-center justify-center text-sm text-[var(--color-mute)]">
                    📷
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 次のレポート／一覧への導線 */}
        <div className="px-5 mt-10 space-y-3">
          {nextReport && (
            <Link
              href={`/clubs/${id}/reports/${nextReport.id}`}
              className="card p-4 block hover:border-[var(--color-accent)]/60 transition"
            >
              <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">次のレポート</div>
              <div className="font-display text-sm leading-snug">{nextReport.title}</div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mt-1">{nextReport.date}</div>
            </Link>
          )}
          <Link
            href={`/clubs/${id}/reports`}
            className="w-full py-3.5 rounded-xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition flex items-center justify-center"
          >
            活動レポート一覧へ戻る
          </Link>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
