"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/categories";

type Props = {
  category: Category;
  question: string;
  answer: string;
  answerIndex: number;
  pageNumber: number;
  onHome: () => void;
};

export default function Oracle({
  category,
  question,
  answer,
  answerIndex,
  pageNumber,
  onHome,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 先让封面停留一瞬，再翻开
    const timer = window.setTimeout(() => setOpen(true), reduce ? 40 : 820);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="screen oracle" aria-labelledby="oracle-answer">
      <div className="book-stage">
        <div className="book" data-open={open}>
          <div className="book__shadow" aria-hidden="true" />
          <div className="book__edges" aria-hidden="true" />

          <div className="page">
            <div className="page__gutter" aria-hidden="true" />

            <div className="page__meta">
              <span className="page__cat">{category}</span>
              <span className="page__no">第 {pageNumber} 页</span>
            </div>

            <div className="page__body" aria-live="polite">
              <p className="page__answer" id="oracle-answer" key={answerIndex}>
                {answer}
              </p>
            </div>

            <div className="page__seal" key={`seal-${answerIndex}`} aria-hidden="true">
              答案之书
            </div>
            <div className="page__glow" key={`glow-${answerIndex}`} aria-hidden="true" />
          </div>

          <div className="cover" aria-hidden="true">
            <span className="cover__top">The Book of Answers</span>
            <span className="cover__lozenge" />
            <span className="cover__title">答案之书</span>
            <span className="cover__lozenge" />
            <span className="cover__foot">翻开即是答案</span>
          </div>
        </div>
      </div>

      <p className="oracle__murmur" data-hidden={open} aria-hidden="true">
        答案正在浮现
      </p>

      <div className="oracle__after" data-open={open}>
        <p className="oracle__echo">你问的是「{question}」</p>
        {/* 故意不提供「再翻一次」。
            能重抽，就等于承认这一页是随机抽出来的 —— 那命运的唯一性就没了。
            翻到哪一页就是哪一页。想再问，只能从头走一次。 */}
        <div className="oracle__actions">
          <button type="button" className="linkbtn" onClick={onHome}>
            回到最初
          </button>
        </div>
      </div>
    </section>
  );
}
