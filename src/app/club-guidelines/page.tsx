"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function ClubGuidelinesPage() {
  const router = useRouter();
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* Title */}
        <div className="px-5 pt-8 pb-6 border-b border-[var(--color-line)]">
          <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">COMMONS CLUB</div>
          <h1 className="font-display text-2xl">クラブガイドライン</h1>
        </div>

        {/* Body */}
        <div className="px-5 py-7 space-y-8">

          {/* Intro */}
          <section>
            <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                <strong className="text-[var(--color-ink)] font-normal">COMMONS CLUB（コモンズクラブ）</strong>は、会員様同士が共通の「好き」をきっかけに、気軽につながり、交流を楽しめるクラブ活動です。
              </p>
              <p>
                グルメ、カフェ、お酒、ランニング、映画、サウナなど。同じ興味を持つ仲間と出会うことで、COMMONSでの楽しみ方がさらに広がります。
              </p>
              <p>
                まずはこちらのガイドラインをご確認のうえ、ぜひ気になるクラブに参加してみてください。
              </p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          {/* Step 1 & 2 */}
          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-5">クラブ参加の流れ ― 簡単2ステップ</h2>
            <div className="space-y-4">
              {[
                {
                  step: "STEP 1",
                  title: "クラブを探す",
                  desc: "クラブ一覧から参加してみたいクラブを探してください。",
                },
                {
                  step: "STEP 2",
                  title: "参加ボタンを押す",
                  desc: "気になるクラブが見つかったら、各クラブ紹介にある「参加ボタン」を押してください。参加後、専用チャンネルが表示されます。\n※ 審査や参加数の制限はございません。",
                },
              ].map(s => (
                <div key={s.step} className="card p-5">
                  <div className="font-display text-[10px] tracking-[0.15em] text-[var(--color-accent-deep)] mb-1">{s.step}</div>
                  <div className="font-display text-base mb-2">{s.title}</div>
                  <p className="text-xs text-[var(--color-mute)] leading-relaxed whitespace-pre-line">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          {/* 退出 */}
          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">クラブから退出したい場合</h2>
            <div className="card p-5 space-y-2 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>クラブから退出したい場合は、各クラブ紹介にある「退出ボタン」を押してください。</p>
              <p className="text-[var(--color-accent-deep)] font-display text-xs">⚠️ 退出後の再参加はできませんのでご注意ください。</p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          {/* 交流会 */}
          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">交流会を開催したい場合</h2>
            <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>COMMONS CLUBでは、会員様であればどなたでも交流会を開催できます。</p>
              <p className="text-[var(--color-mute)] text-xs italic">「このお店に行ってみたい」「同じ趣味の人と集まってみたい」「こんな会があったら楽しそう」</p>
              <p>そう思ったら、ぜひ気軽に企画してみてください。</p>
            </div>
            <div className="mt-4 card p-4 space-y-1.5 text-xs text-[var(--color-mute)] leading-relaxed">
              <p>· 参加者への連絡・リマインド・当日の進行は企画者様を中心に進めてください</p>
              <p>· 写真や動画を投稿する際は、顔出しNGの会員様への配慮をお願いいたします</p>
              <p>· 新しく参加した会員様も入りやすい雰囲気づくりを心がけてください</p>
            </div>
          </section>

          {/* CTA */}
          <div className="pt-2 space-y-3">
            <Link
              href="/clubs"
              className="block w-full py-4 rounded-full font-display text-sm text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              クラブ一覧へ
            </Link>
            <Link
              href="/club-apply"
              className="block w-full py-3 rounded-full font-display text-sm text-center border border-[var(--color-accent)]/40 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition"
            >
              新規クラブを申請する
            </Link>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
