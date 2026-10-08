#!/usr/bin/env node
/**
 * 答案之书 · Supabase 连接自检
 *
 * 用法：node scripts/check-supabase.mjs
 *
 * 它会：
 *   1. 读 .env.local 的两个变量
 *   2. 试着写一条测试记录进 readings 表
 *   3. 再用前端那把 anon key 去读一次，确认「读不到」——这是隐私防线，必须读不到
 *
 * 自检通过之后，测试记录会留在表里，你在 Dashboard 看到它直接删掉就行。
 */

import { readFileSync } from "node:fs";

function loadEnvFile(file) {
  const out = {};
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return out;
  }
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*#/.test(line)) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...process.env,
};

// 有人会把 /rest/v1/ 一起复制过来，这里帮忙清掉
const url = (env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const key = (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

let failed = 0;
const ok = (m) => console.log(`  [OK]   ${m}`);
const bad = (m) => {
  failed += 1;
  console.log(`  [FAIL] ${m}`);
};
const info = (m) => console.log(`         ${m}`);

console.log("\n答案之书 · Supabase 自检\n");

console.log("1. 读取环境变量");
if (!url) {
  bad("NEXT_PUBLIC_SUPABASE_URL 是空的");
  info("打开项目根目录的 .env.local 填上，然后重跑本脚本");
  process.exit(1);
}
ok(`URL = ${url}`);
if (url.includes("/rest/v1")) {
  bad("URL 里不要带 /rest/v1/，只要 https://xxxx.supabase.co 这一段");
}
if (!key) {
  bad("NEXT_PUBLIC_SUPABASE_ANON_KEY 是空的");
  info("Supabase 控制台 → Project Settings → Data API → anon / public key");
  info("填进 .env.local 后重跑本脚本");
  process.exit(1);
}
ok(`anon key 已填（${key.slice(0, 12)}…，共 ${key.length} 字符）`);

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

async function call(path, init) {
  const res = await fetch(`${url}/rest/v1${path}`, { headers, ...init });
  const text = await res.text();
  return { status: res.status, text };
}

console.log("\n2. 试写一条测试记录");
let writeStatus = 0;
try {
  const r = await call("/readings", {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({
      category: "整体运势",
      question: "（这是一条连接自检记录，可以直接删除）",
      answer_text: "签落在地上，响了一声，那便是它要说的",
      answer_index: 999,
      page_number: 250,
      user_agent: "check-supabase.mjs",
      referrer: null,
    }),
  });
  writeStatus = r.status;

  if (r.status === 201 || r.status === 204) {
    ok("写入成功 —— 表建好了、权限也对");
  } else if (r.status === 404) {
    bad("readings 表不存在");
    info("Supabase → SQL Editor → 贴上 supabase/schema.sql → Run");
  } else if (r.status === 401) {
    bad("anon key 不对，或已经被轮换（revoke）过");
    info("回 Project Settings → Data API 重新复制 anon / public key");
  } else if (r.status === 403 || /row-level security/i.test(r.text)) {
    bad("被 RLS 挡住了 —— 建表的 SQL 没跑完整");
    info("Supabase → SQL Editor → 重跑一次完整的 supabase/schema.sql（可重复执行）");
  } else {
    bad(`写入失败：HTTP ${r.status}`);
    info(r.text.slice(0, 300));
  }
} catch (e) {
  bad(`连不上：${e.message}`);
  info("检查网络，或确认项目没有被暂停（免费方案闲置一周会睡）");
}

console.log("\n3. 隐私防线：用同一把 anon key 去读，必须读不到");
if (writeStatus === 201 || writeStatus === 204) {
  try {
    const r = await call("/readings?select=id,category,question&limit=5");
    if (r.status === 200) {
      let rows = [];
      try {
        rows = JSON.parse(r.text);
      } catch {
        /* 忽略 */
      }
      if (Array.isArray(rows) && rows.length > 0) {
        bad(`读到了 ${rows.length} 条记录 —— 权限没收干净！`);
        info("任何访客都能看到用户问过的所有问题。");
        info("回 SQL Editor 执行：");
        info("  revoke select, update, delete on table public.readings from anon, authenticated;");
      } else {
        ok("读回来是空的 —— 陌生人拿到 anon key 也看不到任何人的提问");
      }
    } else if (r.status === 401 || r.status === 403) {
      ok(`读取被拒绝（HTTP ${r.status}）—— 同样安全`);
    } else {
      bad(`读取返回了预期外的 HTTP ${r.status}`);
      info(r.text.slice(0, 300));
    }
  } catch (e) {
    bad(`读取测试连不上：${e.message}`);
  }
} else {
  info("（第 2 步没成功，跳过这一步）");
}

console.log("");
if (failed === 0) {
  console.log("全部通过。现在 npm run dev，去网站上问一次问题，");
  console.log("再到 Supabase → Table Editor → readings 看记录有没有进来。\n");
  process.exit(0);
} else {
  console.log(`有 ${failed} 项没过，按上面的提示修一下再重跑。\n`);
  process.exit(1);
}
