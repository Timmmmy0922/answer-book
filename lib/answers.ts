import raw from "@/data/answers.json";

export const ANSWERS: string[] = raw as string[];

export const ANSWER_COUNT = ANSWERS.length;

export type Draw = {
  /** 抽中的那一句 */
  text: string;
  /** 在答案库里的序号，0 起 */
  index: number;
};

function randomInt(max: number): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * 替来的人翻一页。
 *
 * 抽中哪一页就是哪一页 —— 不重抽、不回避、不做任何「避免重复」的处理。
 * 那是答案之书的规矩：命运只给一次，能重来的就不叫答案了。
 */
export function drawAnswer(): Draw {
  if (ANSWERS.length === 0) {
    return { text: "答案之书今日合着，改日再来。", index: 0 };
  }

  const index = randomInt(ANSWERS.length);
  return { text: ANSWERS[index], index };
}
