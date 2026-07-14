"use client";
import { useState } from "react";
import Link from "next/link";

const PREFS = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
const JOBS = ["経営者・役員","会社員（総合職）","会社員（一般職）","契約社員・派遣社員","パート・アルバイト","公務員（教職員除く）","教職員","医療関係者","自営業","専業主婦・主夫","学生","士業（公認会計士・弁護士・税理士・司法書士）","無職","その他"];
const INCOMES = ["〜300万円","300万円〜500万円","500万円〜700万円","700万円〜900万円","900万円〜1200万円","1200万円〜1500万円","1500万円〜2000万円","2000万円〜"];
const ENTRY_REASONS = ["異性・同性問わず新しい友人づくり","ビジネスやキャリアに関するつながり","趣味や興味が合う人との交流","新しい体験・イベントを楽しみたい","職場・既存コミュニティ以外の居場所づくり"];
const HOW_FOUND = ["COMMONS Instagram","COMMONS TikTok","COMMONS YouTube","COMMONS X","COMMONS Threads","その他"];

function Field({ label, required, children, note }: { label: string; required?: boolean; children: React.ReactNode; note?: string }) {
  return (
    <div>
      <label className="font-display text-xs text-[var(--color-mute)] flex items-center gap-2 mb-1.5">
        {label}
        {required && <span className="text-[9px] px-1.5 py-0.5 rounded border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)]">必須</span>}
      </label>
      {note && <p className="font-display text-[10px] text-[var(--color-mute)] mb-1.5">{note}</p>}
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50">
      {children}
    </select>
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 resize-none placeholder-[var(--color-mute)]" />;
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="col-span-2 pt-4 pb-1 border-b border-[var(--color-line)]">
      <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">{title}</div>
    </div>
  );
}

export default function MemberAddPage() {
  const [entryReasons, setEntryReasons] = useState<string[]>([]);

  function toggleReason(r: string) {
    setEntryReasons(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">MEMBER</div>
          <h1 className="font-display text-2xl mt-0.5">会員追加</h1>
        </div>
        <Link href="/admin/members" className="btn-outline !py-2 text-xs">← 一覧に戻る</Link>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[760px]">
          <div className="grid grid-cols-2 gap-4">

            <SectionHead title="基本情報" />

            <Field label="申込地域" required>
              <div className="flex gap-4">
                {["東京", "大阪"].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer font-display text-sm">
                    <input type="radio" name="region" value={r} className="accent-[var(--color-accent)]" />
                    {r}
                  </label>
                ))}
              </div>
            </Field>

            <div className="col-span-1" />

            <Field label="姓" required><Input placeholder="山田" /></Field>
            <Field label="名" required><Input placeholder="太郎" /></Field>
            <Field label="セイ（フリガナ）" required><Input placeholder="ヤマダ" /></Field>
            <Field label="メイ（フリガナ）" required><Input placeholder="タロウ" /></Field>
            <Field label="生年月日" required>
              <div className="flex gap-2">
                <Select><option value="">年</option>{Array.from({length:85},(_,i)=>2010-i).map(y=><option key={y}>{y}年</option>)}</Select>
                <Select><option value="">月</option>{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m}>{m}月</option>)}</Select>
                <Select><option value="">日</option>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d}>{d}日</option>)}</Select>
              </div>
            </Field>
            <Field label="性別" required>
              <div className="flex gap-4">
                {["男性","女性","その他"].map(g=>(
                  <label key={g} className="flex items-center gap-2 cursor-pointer font-display text-sm">
                    <input type="radio" name="gender" value={g} className="accent-[var(--color-accent)]" />{g}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="メールアドレス" required><Input type="email" placeholder="mail@example.com" /></Field>
            <Field label="電話番号" required note="ハイフンなし・数字のみ"><Input type="tel" placeholder="09012345678" /></Field>
            <Field label="Instagram ID" required note="「@」不要"><Input placeholder="commons_official" /></Field>
            <Field label="都道府県" required>
              <Select><option value="">選択</option>{PREFS.map(p=><option key={p}>{p}</option>)}</Select>
            </Field>

            <SectionHead title="職業・収入" />

            <Field label="ご職業" required>
              <Select><option value="">選択</option>{JOBS.map(j=><option key={j}>{j}</option>)}</Select>
            </Field>
            <Field label="具体的な業種" required><Input placeholder="例）IT・ソフトウェア" /></Field>
            <Field label="勤務先"><Input placeholder="例）株式会社○○" /></Field>
            <Field label="役職・肩書き"><Input placeholder="例）マネージャー" /></Field>
            <Field label="年収" required>
              <Select><option value="">選択</option>{INCOMES.map(i=><option key={i}>{i}</option>)}</Select>
            </Field>

            <SectionHead title="入会動機・自己紹介" />

            <div className="col-span-2">
              <Field label="ご入会の理由（複数回答可）" required>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {ENTRY_REASONS.map(r=>(
                    <label key={r} className="flex items-start gap-2 cursor-pointer font-display text-xs">
                      <input type="checkbox" checked={entryReasons.includes(r)} onChange={()=>toggleReason(r)} className="mt-0.5 accent-[var(--color-accent)]" />
                      {r}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="どのSNS/媒体でCOMMONSをお知りになりましたか" required>
                <Select><option value="">選択</option>{HOW_FOUND.map(h=><option key={h}>{h}</option>)}</Select>
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="自己紹介" required note="審査参考情報（200文字以上）">
                <Textarea rows={5} placeholder="休日の過ごし方や趣味、現在のお仕事、ご自身の性格など" />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="ライフスタイル・人間関係で感じる物足りなさ" required note="50文字以上">
                <Textarea rows={3} placeholder="現在のライフスタイルや人間関係の中で感じることをご記入ください" />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="COMMONSを通して実現したいつながり・日常" required note="50文字以上">
                <Textarea rows={3} placeholder="どんなつながりや日常を実現したいかをご記入ください" />
              </Field>
            </div>

            <SectionHead title="審査・決済情報（別途取得が必要な項目）" />

            <div className="col-span-2">
              <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-5 py-4 space-y-2">
                <div className="font-display text-xs text-[var(--color-accent-deep)] mb-2">以下の情報は別途取得が必要です</div>
                {[
                  { l: "身分証明書", note: "審査フォームまたは運営側で取得" },
                  { l: "顔写真", note: "審査フォームまたは運営側で取得" },
                  { l: "UnivaPayID", note: "決済登録後にシステムから取得" },
                ].map(item => (
                  <div key={item.l} className="flex items-center justify-between py-2 border-b border-[var(--color-line)]">
                    <div>
                      <div className="font-display text-sm">{item.l}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)]">{item.note}</div>
                    </div>
                    <span className="tag text-[9px] border-[var(--color-accent)]/30 text-[var(--color-accent-deep)]">別途取得</span>
                  </div>
                ))}
              </div>
            </div>

            <SectionHead title="管理情報" />

            <Field label="プラン">
              <Select><option>Standard</option><option>Premium</option></Select>
            </Field>
            <Field label="支部">
              <Select><option>東京</option><option>大阪</option></Select>
            </Field>

          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-[var(--color-line)]">
            <button className="btn-primary flex-1 justify-center text-sm py-3">会員を追加する</button>
            <Link href="/admin/members" className="btn-outline flex-1 justify-center text-sm py-3 text-center">キャンセル</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
