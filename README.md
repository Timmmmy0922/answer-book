# 答案之书 · The Book of Answers

> 迷路的旅人啊，在此处与答案之书链接，解开你心中的困惑吧。

**線上網址：<https://timmmmy0922.github.io/answer-book/>** ← 任何裝置、任何地方打開就能用

一個用 **Next.js + Supabase** 做的答案之書網頁，部署在 **GitHub Pages**（也可以改接 Vercel）。三個界面、一千條神諭，後台看得到每一位旅人選了什麼、問了什麼、翻到哪一頁。

網站上的所有文字（含標題、選項、按鈕、一千條答案）都是**简体中文**。手機端做過真機視窗驗證：iPhone 14 / Android / iPhone SE 320px / 橫屏 / 平板都檢查過，沒有橫向溢出。

---

## 目錄

1. [它長什麼樣](#1-它長什麼樣)
2. [檔案結構](#2-檔案結構)
3. [本機先跑起來](#3-本機先跑起來)
4. [建 Supabase 後台](#4-建-supabase-後台)
5. [接上金鑰](#5-接上金鑰)
6. [部署（讓任何人都能打開）](#6-部署讓任何人都能打開)
7. [後台怎麼看用戶選了什麼、問了什麼](#7-後台怎麼看用戶選了什麼問了什麼)
8. [想改東西的話](#8-想改東西的話)
9. [常見問題](#9-常見問題)

---

## 1. 它長什麼樣

三個界面，一條直線走完：

| 界面 | 內容 |
| --- | --- |
| **第一幕 · 首頁** | 一行大標題「迷路的旅人啊，在此处与答案之书链接，解开你心中的困惑吧。」＋ 五個選擇：爱情 / 事业 / 健康 / 学业 / 整体运势 |
| **第二幕 · 提問** | 「把你的困惑，轻轻放在这里」＋ 信紙橫線的大輸入框，底下是 **返回** 與 **提问** |
| **第三幕 · 揭曉** | 一本深棕燙金的《答案之书》，封面自動翻開，內頁隨機浮現一千條裡的一句 |

第三幕下方還有兩個小字按鈕：**再翻一次**（重新抽一句）與 **回到最初**（回首頁）。沒有它們的話，用戶翻完就卡在那一頁了。

視覺是奶油紙本古籍：紙纖維噪點、燙金細線、宋體字、暖色投影，沒有任何紫色漸層或 emoji。

---

## 2. 檔案結構

```
.
├─ app/
│  ├─ layout.tsx          字體、SEO、<html lang="zh-CN">
│  ├─ page.tsx            三個界面的狀態機（step: landing → ask → oracle）
│  ├─ globals.css         整套設計系統（色彩 / 字體 / 間距 / 動效都在這裡）
│  └─ icon.svg            分頁圖示
├─ components/
│  ├─ Landing.tsx         第一幕：大標題 + 選擇區
│  ├─ Ask.tsx             第二幕：輸入框 + 返回 / 提问
│  └─ Oracle.tsx          第三幕：書本圖案 + 答案
├─ lib/
│  ├─ answers.ts          抽籤邏輯（讀 data/answers.json）
│  ├─ categories.ts       五個方向與其英文代號
│  ├─ record.ts           寫進 Supabase（沒設金鑰就寫 localStorage）
│  ├─ supabase.ts         Supabase client
│  └─ motion.ts           入場動畫的延遲序號
├─ data/
│  └─ answers.json        一千條答案，一行一條
├─ supabase/
│  ├─ schema.sql          建表 + 權限（複製到 Supabase SQL Editor 執行）
│  └─ queries.sql         後台常用查詢
├─ scripts/
│  └─ check-supabase.mjs  連線自檢（寫入測試 + 確認前端讀不到）
├─ .github/
│  └─ workflows/
│     └─ deploy.yml       push 到 main 就自動部署到 GitHub Pages
├─ start-dev.bat          雙擊就能在本機跑起來（給不熟終端機的人）
└─ .env.example           環境變數範本
```

---

## 3. 本機先跑起來

需要 **Node.js 20.9 或以上**。

```bash
npm install
npm run dev
```

打開 <http://localhost:3000> 就能玩。

**這時候還不需要 Supabase。** 沒有設定金鑰時，網站照樣抽籤照樣翻書，只是記錄會寫進瀏覽器的 localStorage，並在 F12 Console 印出來。等你把第 4、5 步做完，記錄就會自動進資料庫。

---

## 4. 建 Supabase 後台

### 4-1 開帳號與專案

1. 到 <https://supabase.com> 註冊（可以用 GitHub 帳號登入），免費方案就夠。
2. 進 Dashboard → **New project**。
3. 填：
   - **Name**：`answer-book`
   - **Database Password**：隨便設一組強密碼，**存起來**（之後幾乎用不到，但別弄丟）
   - **Region**：選離你的用戶最近的，例如 `Southeast Asia (Singapore)` 或 `East Asia (Tokyo)`
4. 按 **Create new project**，等 1～2 分鐘讓它把資料庫建好。

### 4-2 建表

1. 左側選單點 **SQL Editor** → **New query**。
2. 打開本專案的 `supabase/schema.sql`，整段複製貼進去。
3. 按右下角 **Run**（或 Ctrl+Enter）。看到 `Success. No rows returned` 就成功了。

這段 SQL 做了四件事：

- 建一張 `readings` 表，欄位是：`created_at`（時間）、`category`（選的方向）、`question`（輸入的問題）、`answer_text`（抽到的答案）、`answer_index`、`page_number`、`user_agent`、`referrer`
- 開了 **Row Level Security**
- 只給前端一把「**只能寫、不能讀**」的權限
- 補上查詢用的索引

> **為什麼要這麼囉唆？**
> 前端連 Supabase 用的 `anon key` 會公開在每個訪客的瀏覽器裡，誰都看得到。
> 所以我們把 RLS 打開、只給 `insert` 權限：陌生人就算拿到你的 key，也只能往表裡塞資料，**讀不到任何一位用戶問過什麼**。
> 而你自己在 Dashboard 的 Table Editor 用的是 `service_role`，不受 RLS 限制，全部看得到。

### 4-3 拿金鑰

> **注意：金鑰不在 `Integrations → Data API` 那一頁。**
> 那一頁只有 REST 端點（`https://xxxx.supabase.co/rest/v1/`），是拿來開關 Data API 整合用的，沒有金鑰。
> 如果你手上有那個網址，把 `/rest/v1/` 去掉就等於 Project URL，但仍要去下面說的地方拿金鑰。

最快的方法：點 Dashboard 右上角那顆綠色的 **Connect** 按鈕（在專案頁的頂部），彈窗裡就同時有 Project URL 和 key。

或者走設定頁：左側側邊欄**最下方**的齒輪圖示 **Project Settings** → **API Keys**。
（直接開這個網址最快：`https://supabase.com/dashboard/project/你的專案代號/settings/api-keys`）

你會看到兩種情況之一：

**情況 A：有 `Publishable and secret API keys` 分頁（新專案）**

| 你要的 | 長相 |
| --- | --- |
| Publishable key ← **就是這把** | `sb_publishable_xxxxxxxx` |
| Secret key ← 絕對不要用 | `sb_secret_xxxxxxxx` |

**情況 B：只有舊版金鑰（較舊的專案）**

切到 **Legacy API keys** 分頁：

| 你要的 | 長相 |
| --- | --- |
| `anon` `public` ← **就是這把** | `eyJhbGciOi...` 一長串 JWT |
| `service_role` ← 絕對不要用 | `eyJhbGciOi...` 一長串 JWT |

> Supabase 正在淘汰舊金鑰（官方公告 2026 年底停用），所以新專案只給 `sb_publishable_` / `sb_secret_`。
> 兩種都拿得到就用 Publishable 那把，`@supabase/supabase-js` 兩者都支援，直接當 anon key 用即可。

> ⚠️ 只要 Publishable / anon 那一把。
> Secret / `service_role` 那把是萬能鑰匙，**絕對不要**放進前端或 Vercel 的 `NEXT_PUBLIC_*` 變數。

---

## 5. 接上金鑰

在專案根目錄建一個 `.env.local`（這個檔案已經被 `.gitignore` 排除，不會進 git）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的專案代號.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_publishable_或_anon_key
```

> 變數名字維持叫 `..._ANON_KEY` 就好，不用改。它裝的是「可以公開的那把」——新版叫 Publishable key（`sb_publishable_...`），舊版叫 anon key（`eyJ...`），兩個都放這裡。
>
> 只填 `https://xxxx.supabase.co` 這一段就好。如果直接從瀏覽器複製了 REST 端點（尾巴帶 `/rest/v1/`），記得把那截刪掉。

存檔後**重啟** `npm run dev`（環境變數改了要重啟才會生效）。

### 5-1 跑一次自檢

```bash
node scripts/check-supabase.mjs
```

它會做三件事：讀環境變數、實際往 `readings` 表寫一條測試記錄、然後**用同一把 anon key 去讀一次並確認讀不到**（這是隱私防線，讀得到就是出事了）。看到全部 `[OK]` 就代表前後端通了。測試記錄會留在表裡，在 Dashboard 看到直接刪掉即可。

### 5-2 看第一筆真實記錄

去網站上問一次問題，然後到 Supabase → **Table Editor** → `readings` 表，應該就會看到那一筆記錄了。

---

## 6. 部署（讓任何人都能打開）

**本機跑的 `npm run dev` 只有你自己看得到。** 別人要能開，就得放上公網。

### 6-1 現況：已經部署在 GitHub Pages 上了

網站網址：**https://timmmmy0922.github.io/answer-book/**

這個網址是全世界的。手機用行動網路、別人在別的國家、對方什麼都不用裝，打開就能用。資料統一進同一個 Supabase，你在同一個後台看到所有人的提問。

**運作方式**：`.github/workflows/deploy.yml`。每次你 `git push` 到 `main`，GitHub 會自動重新建置並發佈，一到兩分鐘後生效，網址不變。

**為什麼是靜態匯出**：GitHub Pages 只放靜態檔案，所以 workflow 裡會把 `GITHUB_PAGES=true`，`next.config.mjs` 偵測到這個變數才會打開 `output: "export"` 並把 `basePath` 設成 `/answer-book`（因為網址帶子路徑）。**本機開發不受影響**，`npm run dev` 依然是 `http://localhost:3000`。

**那兩個環境變數放在哪**：不在 `.env.local`，而是在 GitHub repo 的 Actions variables 裡：

```
gh variable list --repo 你的帳號/answer-book
```

要改就 `gh variable set 變數名 --body "值" --repo 你的帳號/answer-book`，然後重新跑一次 workflow（或 push 一個 commit）。

### 6-2 日常更新流程

```bash
git add -A
git commit -m "改了什麼"
git push
```

推上去就自動重新部署。想看這次跑得怎樣：

```bash
gh run list --limit 3
gh run watch
```

### 6-3 想換成 Vercel（可選）

GitHub Pages 的網址帶一個 `/answer-book/` 子路徑。如果你想要更乾淨的 `https://answer-book-xxx.vercel.app` 或綁自己的網域，可以另外接到 Vercel——兩邊可以並存，不衝突：

1. 到 <https://vercel.com> 用 GitHub 帳號登入。
2. **Add New… → Project** → 選 `answer-book` → **Import**。
3. Framework 會自動認出 **Next.js**，Build Command、Output Directory 都不用改。
4. 展開 **Environment Variables**，加兩條（名字一字不差）：

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://你的專案代號.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 publishable / anon key |

   **三個環境（Production / Preview / Development）都勾。**
5. 按 **Deploy**。

> ⚠️ 在 Vercel 上**不要**設 `GITHUB_PAGES=true`，那個變數是給 GitHub Pages 用的。Vercel 走正常的 Next.js 模式，網址是根目錄。
>
> 反過來說：`GITHUB_PAGES` 只存在於 workflow 裡，Vercel 從來不會看到它，所以不會打架。

---

## 7. 後台怎麼看用戶選了什麼、問了什麼

### 方法一：Table Editor（最直覺）

Supabase → 左側 **Table Editor** → 選 `readings`。

就是一張表格，點欄位標題可以排序，右上角可以下載 CSV。你關心的三欄是：

- `category` — 用戶選了愛情還是事業
- `question` — 用戶打的那段話
- `answer_text` — 書翻給他看的那一句

### 方法二：SQL Editor（要看統計時用）

打開 `supabase/queries.sql`，裡面有八條已經寫好的查詢，直接複製貼上就能跑：

1. 最新 50 條（時間 / 方向 / 用戶輸入 / 抽到的答案）
2. 大家最關心什麼（各方向占比）
3. 每天的提問量 + 獨立裝置數
4. 相同問題排行（大家都在問同一件事嗎）
5. 全文搜尋提問（例如把所有含「分手」的找出來）
6. 哪些答案最常被翻到
7. 活躍時段分布
8. 全部匯出 CSV

### 額外提醒

- **時間**：資料庫存的是 UTC，查詢裡已經用 `at time zone 'Asia/Shanghai'` 轉成台北時間。要改時區就搜尋那段字串替換。
- **重複計算**：用戶按「再翻一次」也會記一條，所以同一個問題可能對應多筆。要排除的話，只統計每個 `question` 的第一筆就好。
- **防灌水**：`schema.sql` 最後有一段被註解掉的 rate limit 觸發器（每分鐘上限 120 筆），需要時把註解拿掉再執行一次。

---

## 8. 想改東西的話

| 想改什麼 | 去哪改 |
| --- | --- |
| 標題文字 | `components/Landing.tsx` 裡的 `title__lead` / `title__rest` |
| 五個選項 | `lib/categories.ts` 的 `CATEGORIES`（記得同步 `CATEGORY_NUMERALS` 和 `CATEGORY_KEYS`） |
| 輸入框上面的文案 | `components/Ask.tsx` 的 `ask__title` 與 `ask__hint` |
| 一千條答案 | `data/answers.json`，一行一條，改完存檔即可 |
| 顏色 | `app/globals.css` 最上面的 `:root`，全部是 CSS 變數 |
| 字體 | `app/layout.tsx` 的 Google Fonts `<link>`，以及 `globals.css` 的 `--font-serif` |
| 動畫速度 | `globals.css` 的 `--ease-out` / `--ease-inout`，以及各處的秒數 |

改答案庫時注意：`data/answers.json` 必須是**合法的 JSON 陣列**（每一行有引號、有逗號，最後一條不要逗號），而且**條數不限**——首頁會自動顯示正確的藏書數量。

想自己驗證檔案沒寫壞：

```bash
node -e "const a=require('./data/answers.json'); console.log('共', a.length, '条; 去重后', new Set(a).size, '条')"
```

---

## 9. 常見問題

**Q：網站跑得起來，但 Supabase 裡沒有資料？**
依序檢查：

1. `.env.local` 的兩個變數名字有沒有打錯（前面是 `NEXT_PUBLIC_`）
2. 改完環境變數有沒有重啟 `npm run dev`
3. 瀏覽器 F12 → Console 有沒有紅字；有的話多半是 RLS 或表名不對
4. Supabase → **Table Editor** 確認表真的叫 `readings`
5. 在 Vercel 上，環境變數要重新 **Redeploy** 才會生效

**Q：F12 出現 `new row violates row-level security policy`？**
`schema.sql` 沒跑完整，或 policy 沒建起來。到 SQL Editor 重跑一次整份 `schema.sql`（它是可重複執行的）。

**Q：為什麼我在前端讀不到資料？**
故意的。前端只有 `insert` 權限，讀取一律走 Dashboard。這是為了保護用戶隱私——畢竟沒人希望自己問的問題被別人看到。

**Q：Supabase 免費方案夠嗎？**
夠。免費方案有 500MB 資料庫。一筆記錄大約 200～500 bytes，一千萬筆才會滿。閒置一週的專案會被暫停，回 Dashboard 點一下就能喚醒。

**Q：想加密碼保護的 /admin 頁面？**
目前刻意不做（你選了用 Dashboard 看）。之後要加的話，在 Vercel 加一個 `ADMIN_PASSWORD` 環境變數，寫一個 `app/admin/page.tsx` 在**伺服器端**用 `service_role` key 查詢即可——切記 `service_role` 只能出現在伺服器端程式碼裡。

**Q：字體在中國大陸載不出來？**
Google Fonts 會被牆。CSS 裡的 `--font-serif` 已經排了 `<宋体>` 這類系統字型在後面，所以會自動退回系統宋體，版面不會壞。想完全自己掌控字體，把字型檔放進 `public/fonts/`，用 `next/font/local` 載入。

---

## 授權與致謝

一千條答案為本專案原創撰寫，靈感來自 *The Book of Answers*（Carol Bolt）那類「隨手翻一頁就是答案」的占卜書傳統。
