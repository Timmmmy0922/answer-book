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
 * 从答案库里随机抽一条。
 * 传入上一次的序号，可以避免连续两次抽到同一句。
 */
export function drawAnswer(excludeIndex?: number): Draw {
  const total = ANSWERS.length;

  if (total === 0) {
    return { text: "答案之书今日合着，改日再来。", index: 0 };
  }

  let index = randomInt(total);

  if (total > 1 && excludeIndex !== undefined && excludeIndex >= 0) {
    let guard = 0;
    while (index === excludeIndex && guard < 16) {
      index = randomInt(total);
      guard += 1;
    }
    if (index === excludeIndex) index = (index + 1) % total;
  }

  return { text: ANSWERS[index], index };
}
