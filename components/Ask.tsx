"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Category } from "@/lib/categories";
import { stagger } from "@/lib/motion";

const MAX_LENGTH = 500;

type Props = {
  category: Category;
  initialQuestion: string;
  onBack: () => void;
  onDraftChange: (draft: string) => void;
  onSubmit: (question: string) => void;
};

export default function Ask({
  category,
  initialQuestion,
  onBack,
  onDraftChange,
  onSubmit,
}: Props) {
  const [value, setValue] = useState(initialQuestion);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 让「返回」之后再进来，刚才写下的字还在
  function update(next: string) {
    setValue(next);
    onDraftChange(next);
  }

  useEffect(() => {
    // 进来就能直接打字
    const t = window.setTimeout(() => inputRef.current?.focus(), 620);
    return () => window.clearTimeout(t);
  }, []);

  const ready = value.trim().length > 0;
  const nearLimit = value.length > MAX_LENGTH * 0.9;

  function submit() {
    const question = value.trim();
    if (!question) return;
    onSubmit(question.slice(0, MAX_LENGTH));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <section className="screen screen--ask ask" aria-labelledby="ask-title">
      <header className="ask__head">
        <p className="kicker rise" style={stagger(0)}>
          The Book Is Listening
        </p>
        <h2 className="ask__title rise" id="ask-title" style={stagger(1)}>
          把你的困惑，轻轻放在这里
        </h2>
        <p className="ask__hint rise" style={stagger(2)}>
          不必写得清楚，也不必写得体面。
          <br />
          书页翻动的声音，比字句更响。
        </p>
        <div className="chip-row rise" style={stagger(3)}>
          <span className="chip">
            <span className="chip__dot" aria-hidden="true" />
            你想问的是 · {category}
          </span>
        </div>
      </header>

      <div className="paper rise" style={stagger(4)}>
        <div className="paper__lines" aria-hidden="true" />
        <label className="sr-only" htmlFor="question">
          写下你的困惑
        </label>
        <textarea
          id="question"
          ref={inputRef}
          className="ask__input"
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(event) => update(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：我该不该把这件事说出口……"
          spellCheck={false}
          autoComplete="off"
        />
        <div className="paper__foot">
          <span>此处只有你与书</span>
          <span className="paper__count" data-warn={nearLimit}>
            {value.length} / {MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="actions rise" style={stagger(5)}>
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          返回
        </button>
        <button
          type="button"
          className="btn btn--ink"
          onClick={submit}
          disabled={!ready}
        >
          提问
        </button>
      </div>

      <p className="actions__note" aria-live="polite">
        {ready ? "按 Ctrl / ⌘ + Enter 也可以提问" : "写下你的困惑后，书才会应你"}
      </p>
    </section>
  );
}
