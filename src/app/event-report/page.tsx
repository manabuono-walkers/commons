"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function EventReportPage() {
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

        {/* Hero image */}
        <div className="relative h-[280px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/eventrepo.png" alt="AGE 26+ NIGHT" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,22,1) 0%, rgba(11,15,22,0.2) 60%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">EVENT REPORT</p>
            <h1 className="font-display text-3xl leading-tight text-white">AGE 26+ NIGHT<br />開催レポート</h1>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-5 py-5 border-b border-[var(--color-line)]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "開催日", value: "6月26日（金）" },
              { label: "会場", value: "THE THEATRE TABLE" },
              { label: "参加人数", value: "65名" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{item.label}</div>
                <div className="font-display text-xs text-[var(--color-ink-soft)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-7 space-y-6">

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">イベント概要</h2>
            <div className="space-y-4 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                先日は、渋谷ヒカリエ11階にあるイタリアンレストラン「THE THEATRE TABLE」にて、<strong className="text-[var(--color-ink)] font-normal">『AGE 26+ NIGHT』</strong>を開催しました。
              </p>
              <p>
                『AGE 26+ NIGHT』は、26〜35歳の方限定でご参加いただける、同世代交流をテーマにしたイベントです。
              </p>
              <p>
                当日は総勢65名の方にご参加いただき、受付開始後から会場は明るくにぎやかな雰囲気に包まれました。
              </p>
              <p>
                年齢が近い方同士ということもあり、初対面でも話しやすい空気感があり、各テーブルでは仕事のこと、休日の過ごし方、最近ハマっていることなど、さまざまな話題で自然と会話が弾んでいました。
              </p>
              <p>
                会場の落ち着いた雰囲気もあり、ゆっくり会話を楽しみながら交流されている方が多かったのも印象的でした。
              </p>
              <p>
                イベント後には、二次会へ向かわれた方も多く、イベント内だけで終わらないつながりが生まれていたことを、運営としてもとても嬉しく感じています。
              </p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">運営から一言</h2>
            <div className="card p-5 space-y-4 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                今回も、開始直後から会場全体がとても盛り上がり、終始にぎやかな雰囲気の中で開催することができました。
              </p>
              <p>
                運営中も、各テーブルから楽しそうな笑い声が聞こえてきて、皆さまが自然に交流を楽しんでいる姿がとても印象的でした。
              </p>
              <p>
                世代別イベントは毎回多くの方にご好評いただいておりますので、今後も定期的に開催していく予定です。
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="pt-2">
            <Link
              href="/events"
              className="block w-full py-4 rounded-full font-display text-sm text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              次のイベントを見る
            </Link>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
