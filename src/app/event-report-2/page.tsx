"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function EventReport2Page() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/home" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* Hero image */}
        <div className="relative h-[280px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/eventrepo2.png" alt="WINE NIGHT Vol.15" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,22,1) 0%, rgba(11,15,22,0.2) 60%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">EVENT REPORT</p>
            <h1 className="font-display text-3xl leading-tight text-white">COMMONS WINE NIGHT<br />Vol.15 開催レポート</h1>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-5 py-5 border-b border-[var(--color-line)]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "開催日", value: "7月5日（土）" },
              { label: "会場", value: "La Cave 麻布十番" },
              { label: "参加人数", value: "24名" },
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
                先日は、麻布十番の人気ワインバー「La Cave」にて、<strong className="text-[var(--color-ink)] font-normal">『COMMONS WINE NIGHT Vol.15』</strong>を開催しました。
              </p>
              <p>
                COMMONS WINE NIGHTは、ソムリエ監修のもと厳選されたワインを囲みながら、会員同士が深く交流することをテーマにした定期開催イベントです。
              </p>
              <p>
                今回のテーマは「ブルゴーニュ再発見」。ピノ・ノワールの産地ごとの個性を比較しながら、参加者それぞれが自分好みの1本を見つけていく、ソムリエ解説付きのテイスティング形式で行いました。
              </p>
              <p>
                当日は24名の方にご参加いただき、序盤から各テーブルでワインをめぐる活発な会話が生まれていました。普段なかなか飲み比べる機会のない銘柄を前に、参加者の目が輝いていた場面がとても印象的でした。
              </p>
              <p>
                イベントの後半では、ソムリエによる「自宅での保存・開け方」のミニレクチャーも実施。より深く楽しめるヒントを得た方が多く、参加者からも好評をいただきました。
              </p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">運営から一言</h2>
            <div className="card p-5 space-y-4 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                今回もおかげさまで、全席満席・大盛況のうちに幕を閉じることができました。
              </p>
              <p>
                WINE NIGHTは回を重ねるごとに常連の方も増え、初参加の方でもすぐに打ち解けられる温かい雰囲気が生まれています。この空気感こそ、COMMONS WINENIGHTの最大の魅力だと感じています。
              </p>
              <p>
                次回Vol.16は、8月を予定しております。夏らしい白ワインをテーマにした特集回になる予定ですので、ぜひお楽しみに。
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
