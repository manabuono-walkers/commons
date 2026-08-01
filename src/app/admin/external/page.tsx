"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SERVICES: Record<string, { label: string; desc: string }> = {
  ga: { label: "Google Analytics", desc: "サイト・アプリのアクセス状況、ユーザー行動、流入経路などを分析します。" },
  heatmap: { label: "ヒートマップ", desc: "画面上でのクリック・タップ・スクロールの分布を可視化し、UI改善に役立てます。" },
};

function ExternalContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("service") ?? "";
  const service = SERVICES[key] ?? { label: "外部サービス", desc: "" };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">ANALYTICS</div>
        <h1 className="font-display text-2xl mt-0.5">{service.label}</h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-[480px] text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--color-line)] flex items-center justify-center mx-auto mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
          <div className="tag text-[9px] mb-3">他サービス管理画面</div>
          <h2 className="font-display text-xl mb-2">{service.label}の管理画面に遷移します</h2>
          <p className="font-display text-xs text-[var(--color-mute)] leading-relaxed mb-1">{service.desc}</p>
          <p className="font-display text-[10px] text-[var(--color-mute)] leading-relaxed mt-4">
            ※ 実際の運用では{service.label}側の管理画面（外部サービス）へ遷移します。このモックでは代わりに本画面を表示しています。
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ExternalServicePage() {
  return (
    <Suspense fallback={null}>
      <ExternalContent />
    </Suspense>
  );
}
