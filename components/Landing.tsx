"use client";

import {
  CATEGORIES,
  CATEGORY_KEYS,
  CATEGORY_NUMERALS,
  type Category,
} from "@/lib/categories";
import { stagger } from "@/lib/motion";

type Props = {
  total: number;
  onPick: (category: Category) => void;
};

export default function Landing({ total, onPick }: Props) {
  return (
    <section className="screen landing" aria-labelledby="book-title">
      <p className="kicker rise" style={stagger(0)}>
        The Book of Answers
      </p>

      <h1 className="title rise" id="book-title" style={stagger(1)}>
        <span className="title__lead">迷路的旅人啊，</span>
        <span className="title__rest">
          在此处与答案之书链接，解开你心中的困惑吧
        </span>
      </h1>

      <div className="rule rise" style={stagger(2)} aria-hidden="true" />

      <p className="chooser-head rise" style={stagger(3)}>
        你此刻最放不下的是
      </p>

      <div
        className="chooser rise"
        style={stagger(4)}
        role="group"
        aria-label="选择你最关注的方向"
      >
        {CATEGORIES.map((category, i) => (
          <button
            key={category}
            type="button"
            className="tile"
            onClick={() => onPick(category)}
          >
            <span className="tile__num" aria-hidden="true">
              {CATEGORY_NUMERALS[i]}
            </span>
            <span className="tile__label">{category}</span>
            <span className="tile__gloss" aria-hidden="true">
              {CATEGORY_KEYS[category]}
            </span>
          </button>
        ))}
      </div>

      <p className="colophon rise" style={stagger(5)}>
        答案之书 · 藏书 {total} 条
      </p>
    </section>
  );
}
