import { getSupabase, isSupabaseConfigured } from "./supabase";

export type Reading = {
  /** 用户选的关注方向，例如「爱情」 */
  category: string;
  /** 用户输入的问题原文 */
  question: string;
  /** 抽中的那一句答案 */
  answer: string;
  /** 答案在 1000 条里的序号（0 起） */
  answerIndex: number;
  /** 换算出来的页码，4 条一页 */
  pageNumber: number;
};

const LOCAL_KEY = "answer-book:readings";
const PER_PAGE = 4;

export function pageOf(answerIndex: number): number {
  return Math.floor(answerIndex / PER_PAGE) + 1;
}

function localRecord(reading: Reading) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push({ ...reading, created_at: new Date().toISOString() });
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(-500)));
  } catch {
    /* localStorage 满了或被禁用，忽略即可，不影响抽签 */
  }
  // 方便你在本机 F12 控制台直接看记录
  console.info("[答案之书] 未配置 Supabase，已存到 localStorage:", reading);
}

/**
 * 把这次提问写进后台。
 * 写失败绝不打断用户体验 —— 答案已经翻出来了，记录是后台的事。
 */
export async function recordReading(reading: Reading): Promise<void> {
  const supabase = getSupabase();

  if (!supabase) {
    localRecord(reading);
    return;
  }

  const { error } = await supabase.from("readings").insert({
    category: reading.category,
    question: reading.question,
    answer_text: reading.answer,
    answer_index: reading.answerIndex,
    page_number: reading.pageNumber,
    user_agent: typeof navigator === "undefined" ? null : navigator.userAgent.slice(0, 400),
    referrer: typeof document === "undefined" ? null : (document.referrer || null),
  });

  if (error) {
    console.error("[答案之书] 写库失败:", error.message);
    localRecord(reading);
  }
}

export { isSupabaseConfigured };
