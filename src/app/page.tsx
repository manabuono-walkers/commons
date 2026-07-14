import Link from "next/link";

const groups = [
  { group: "アプリ（会員向け・新規）", items: [
    { href: "/home", n: "01", title: "ホーム", desc: "タイムライン・お知らせ・キャンペーンバナー", tag: "新規" },
    { href: "/community", n: "02", title: "タイムライン", desc: "全会員向けXライク自由投稿・いいね", tag: "新規" },
    { href: "/clubs", n: "03", title: "COMMONS CLUB一覧", desc: "COMMONS CLUB参加/退出・ガイドラインモーダル", tag: "新規" },
    { href: "/clubs/wine", n: "04", title: "COMMONS CLUB詳細（ワイン部）", desc: "フリーチャット / イベント募集 / 活動レポート 3タブ", tag: "新規" },
    { href: "/stores", n: "05", title: "提携店舗・クーポン", desc: "店舗マップ + 会員特典クーポン管理", tag: "新規" },
    { href: "/mypage", n: "06", title: "マイページ", desc: "ポイント・ランク・お問い合わせ・意見箱・会員証", tag: "新規" },
  ]},
  { group: "既存画面", items: [
    { href: "/events", n: "07", title: "イベント一覧", desc: "カテゴリ絞り込み／先着・抽選", tag: "既存" },
    { href: "/login", n: "08", title: "サインイン", desc: "会員ログイン画面", tag: "既存" },
    { href: "/register", n: "09", title: "新規登録", desc: "Apple/Googleソーシャル登録 + フォーム", tag: "既存" },
    { href: "/apply", n: "10", title: "入会審査申込", desc: "5ステップフォーム", tag: "既存" },
    { href: "/admin", n: "11", title: "管理画面", desc: "KPI／会員一覧／対応キュー", tag: "既存" },
    { href: "/admin_login", n: "11b", title: "管理者ログイン画面", desc: "管理コンソール専用認証画面（二分割レイアウト）", tag: "既存" },
    { href: "/dashboard", n: "12", title: "マイページ（旧版）", desc: "プラン・支払・ランク・ポイント・参加履歴", tag: "既存" },
    { href: "/map", n: "13", title: "店舗マップ（旧版）", desc: "提携店舗のピン表示・会員特典", tag: "既存" },
  ]},
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-16 pb-24 md:px-10">
      <header className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-6">
        <div>
          <div className="font-display text-xs text-[var(--color-mute)]">
            モックアップ／株式会社ONE LIKE 様向け
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-wide">COMMONS — 画面確認テストハブ</h1>
          <p className="mt-2 text-xs text-[var(--color-mute)]">Discord機能網羅版 · ボトムナビ5タブ（ホーム/イベント/クラブ/店舗/マイページ）</p>
        </div>
        <div className="text-right text-xs font-display text-[var(--color-mute)]">
          2026年7月6日／Walkers
        </div>
      </header>

      <div className="mt-5 flex items-center gap-5 text-xs">
        <div className="flex items-center gap-2"><span className="tag tag-accent">新規</span><span className="text-[var(--color-mute)]">Discord機能を追加した新規画面</span></div>
        <div className="flex items-center gap-2"><span className="tag">既存</span><span className="text-[var(--color-mute)]">前回版から継続</span></div>
      </div>

      {groups.map((g) => (
        <div key={g.group} className="mt-12">
          <div className="eyebrow mb-4">{g.group}</div>
          <ul className="divide-y divide-[var(--color-line)] border-t border-b border-[var(--color-line)]">
            {g.items.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 py-5 transition-colors hover:bg-[var(--color-bg-soft)]/60 px-2"
                >
                  <span className="num text-2xl text-[var(--color-mute)] w-10">{s.n}</span>
                  <div>
                    <div className="font-display text-2xl">{s.title}</div>
                    <div className="mt-1 text-sm text-[var(--color-mute)]">{s.desc}</div>
                  </div>
                  <span className={`tag ${s.tag === "新規" ? "tag-accent" : "tag-soft"}`}>{s.tag}</span>
                  <span className="font-display text-xs text-[var(--color-mute)]">{s.href}</span>
                  <span className="font-display text-xs transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent-deep)]">
                    確認 →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="mt-10 text-xs text-[var(--color-mute)] leading-relaxed">
        ※ 全画面のデータはダミーです。決済・認証等は動作しません。<br />
        ※ 推奨実装方式：Webviewハイブリッド（Capacitor + Next.js）。
      </p>
    </main>
  );
}
