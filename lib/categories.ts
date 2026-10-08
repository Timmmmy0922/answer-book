export const CATEGORIES = [
  "爱情",
  "事业",
  "健康",
  "学业",
  "整体运势",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** 签号用的汉字数字 */
export const CATEGORY_NUMERALS = ["一", "二", "三", "四", "五"] as const;

/** 每个方向在后台的英文标识，方便你之后做筛选 */
export const CATEGORY_KEYS: Record<Category, string> = {
  爱情: "love",
  事业: "career",
  健康: "health",
  学业: "study",
  整体运势: "fortune",
};
