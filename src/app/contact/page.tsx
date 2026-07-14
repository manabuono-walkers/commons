"use client";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

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

        <div className="px-5 pt-8 space-y-6 pb-10">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">Support</p>
            <h1 className="font-display text-2xl">お問い合わせ</h1>
            <p className="text-xs text-[var(--color-mute)] mt-2 leading-relaxed">
              コミュニティに関するお問い合わせは、公式LINEまたはInstagramのDMにてお願いいたします。
            </p>
          </div>

          {/* LINE */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-none" style={{ background: "#06C755" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.7 1.28 5.12 3.31 6.79L4.5 22l4.36-2.3C10.1 20.23 11.03 20.4 12 20.4c5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-sm">会員様限定 公式LINE</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">最も早くご返信できます</div>
              </div>
            </div>
            <a
              href="https://lin.ee/ZXoccM2"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-full font-display text-sm text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#06C755", color: "#fff" }}
            >
              LINEでお問い合わせ
            </a>
          </div>

          {/* Instagram DM */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-none" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-sm">Instagram DM</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">@commons_official</div>
              </div>
            </div>
            <div className="font-display text-xs text-[var(--color-mute)] leading-relaxed">
              InstagramのDMからもお問い合わせいただけます。
            </div>
          </div>

          {/* FAQ */}
          <div className="card p-5">
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">よくある質問</div>
            <p className="text-xs text-[var(--color-mute)] leading-relaxed mb-4">
              よくいただくお問い合わせについては、FAQページでご確認いただけます。
            </p>
            <a
              href="https://onelike.jp/commons/general/faq/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-sm text-[var(--color-accent-deep)] flex items-center gap-1.5 hover:opacity-70 transition"
            >
              FAQを見る
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>

          <p className="text-[10px] text-[var(--color-mute)] leading-relaxed px-1">
            ※ 上記以外のお問い合わせにつきましては、対応いたしかねますのでご了承ください。
          </p>

          <button onClick={() => router.back()} className="w-full btn-outline justify-center">戻る</button>
        </div>
      </div>
    </div>
  );
}
