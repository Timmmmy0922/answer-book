"use client";

import { useCallback, useState } from "react";
import Ask from "@/components/Ask";
import Landing from "@/components/Landing";
import Oracle from "@/components/Oracle";
import { drawAnswer, type Draw } from "@/lib/answers";
import type { Category } from "@/lib/categories";
import { pageOf, recordReading } from "@/lib/record";

type Step = "landing" | "ask" | "oracle";

export default function Page() {
  const [step, setStep] = useState<Step>("landing");
  const [category, setCategory] = useState<Category>("整体运势");
  /** 输入框里的草稿，返回时留着 */
  const [draft, setDraft] = useState("");
  /** 真正提交出去的那个问题，揭晓页会把它念回来 */
  const [question, setQuestion] = useState("");
  const [draw, setDraw] = useState<Draw | null>(null);

  /** 每次翻页都记一条，后台就能看到谁选了什么、问了什么、翻到哪一句 */
  const log = useCallback(
    (d: Draw, cat: Category, q: string) => {
      void recordReading({
        category: cat,
        question: q,
        answer: d.text,
        answerIndex: d.index,
        pageNumber: pageOf(d.index),
      });
    },
    []
  );

  const handlePick = useCallback((picked: Category) => {
    setCategory(picked);
    setStep("ask");
  }, []);

  const handleSubmit = useCallback(
    (q: string) => {
      const d = drawAnswer();
      setDraft(q);
      setQuestion(q);
      setDraw(d);
      setStep("oracle");
      log(d, category, q);
    },
    [category, log]
  );

  const handleRedraw = useCallback(() => {
    const d = drawAnswer(draw?.index);
    setDraw(d);
    log(d, category, question);
  }, [category, draw?.index, log, question]);

  /** 「回到最初」是真的重来一遍，草稿也一并清掉 */
  const handleHome = useCallback(() => {
    setStep("landing");
    setDraw(null);
    setDraft("");
    setQuestion("");
  }, []);

  return (
    <main className="stage">
      {step === "landing" && (
        <Landing key="landing" onPick={handlePick} />
      )}

      {step === "ask" && (
        <Ask
          key="ask"
          category={category}
          initialQuestion={draft}
          onBack={() => setStep("landing")}
          onDraftChange={setDraft}
          onSubmit={handleSubmit}
        />
      )}

      {step === "oracle" && draw && (
        <Oracle
          key="oracle"
          category={category}
          question={question}
          answer={draw.text}
          answerIndex={draw.index}
          pageNumber={pageOf(draw.index)}
          onRedraw={handleRedraw}
          onHome={handleHome}
        />
      )}
    </main>
  );
}
