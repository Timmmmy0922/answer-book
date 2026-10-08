# 答案之书 · The Book of Answers

> 迷路的旅人啊，在此处与答案之书链接，解开你心中的困惑吧。

**線上網址：<https://timmmmy0922.github.io/answer-book/>** ← 海外任何裝置都能開

> ⚠️ **這個網址在中國大陸打不開**（`*.github.io` 被牆）。要讓國內訪客免翻牆使用，看第 6 節——需要自己的網域＋騰訊雲 EdgeOne Pages，程式碼已經為此準備好，不用改任何一行。

一個用 **Next.js + Supabase** 做的答案之書網頁。純靜態，可放任何靜態空間（目前掛在 GitHub Pages）。三個界面、一千條神諭，後台看得到每一位旅人選了什麼、問了什麼、翻到哪一頁。

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

第三幕下方只有一個小字按鈕：**回到最初**。

> **刻意不做「再翻一次」。** 能重抽，就等於承認這一頁是隨機抽出來的——命運的唯一性當場就沒了。翻到哪一頁就是哪一頁；想再問，只能從頭走一次。程式碼裡的 `drawAnswer()` 也**不做任何「避免連續抽到同一句」的處理**，因為那正是「這只是個隨機產生器」的自我招認。

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
├─ public/
│  └─ fonts/              自托管字体（Noto Serif SC + Cormorant Garamond）
│     ├─ noto-serif-sc.css    @font-face 规则，内无任何外部连线
│     ├─ noto-serif-sc/       101 个 woff2 切片，可变字重 300–900
│     └─ cormorant-garamond/  10 个 woff2 切片
├─ scripts/
│  └─ check-supabase.mjs  連線自檢（寫入測試 + 確認前端讀不到）
├─ .github/
│  └─ workflows/
│     └─ deploy.yml       push 到 main 就自動部署到 GitHub Pages
├─ start-dev.bat          雙擊就能在本機跑起來（給不熟終端機的人）
└─ .env.example           環境變數範本
```

> **字型為什麼放在自己家？** `fonts.googleapis.com` 在中國大陸打不開。放在 `public/fonts/` 之後，訪客完全不會連到 Google。workflow 裡還有一道防線：只要產物中出現 `fonts.googleapis.com` 或 `fonts.gstatic.com`，建置就會直接失敗，避免哪天不小心又加回去。

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

### 6-0 ⚠️ 先講清楚：免費的西方主機，國內打不開

這件事沒有技術手段可以繞過，先把事實攤開：

| 主機 | 免費子網域 | 中國大陸 |
| --- | --- | --- |
| **GitHub Pages** | `*.github.io` | **打不開**（長期被封） |
| **Vercel** | `*.vercel.app` | **打不開**（官方文件自己說「可能載入很慢或失敗」） |
| **Netlify** | `*.netlify.app` | 不穩定，多數打不開 |
| **Cloudflare Pages** | `*.pages.dev` | 時通時不通，速度差；想改善得自己搞「優選 IP」，但那是違反 Cloudflare 條款的偏方 |

所以要讓**國內訪客免翻牆**打開，避免不了兩件事：**一個自己的網域**，以及第 6-2 節的三選一。

> 好消息是：字型已經全部託管在自己的網站上，網頁本身**不會連任何被牆的第三方**。所以只要主機國內連得到，網站就完全正常。

### 6-1 目前：GitHub Pages（給海外訪客／你自己驗收用）

網站網址：**https://timmmmy0922.github.io/answer-book/**

這個網址全世界都能開，但**國內打不開**。先留著，方便你自己隨時看最新版本。

**運作方式**：`.github/workflows/deploy.yml`。每次你 `git push` 到 `main`，GitHub 會自動重新建置並發佈，一到兩分鐘後生效，網址不變。

**為什麼是靜態匯出**：GitHub Pages 只放靜態檔案，所以 workflow 設 `STATIC_EXPORT=true`、`BASE_PATH=/answer-book`，`next.config.mjs` 偵測到才會打開 `output: "export"`。**本機開發不受影響**，`npm run dev` 依然是 `http://localhost:3000`（不帶子路徑）。

**那兩個環境變數放在哪**：不在 `.env.local`，而是在 GitHub repo 的 Actions variables 裡：

```
gh variable list --repo 你的帳號/answer-book
```

要改就 `gh variable set 變數名 --body "值" --repo 你的帳號/answer-book`，然後重新跑一次 workflow（或 push 一個 commit）。

### 6-2 要讓國內免翻牆打開 — 三個方案

#### 方案 A：騰訊雲 EdgeOne Pages ＋ 自己的網域 ⭐ 推薦（免備案）

騰訊自家產品，官方定位就是「Vercel 的中國替代方案」。**程式碼完全不用改**，它認得 `out/` 這個靜態目錄。

1. 買一個網域（`.top` / `.xyz` 一年約 ¥10–30；國外註冊商如 Cloudflare Registrar、Namecheap 都可以，不必實名）。
2. 到 <https://console.cloud.tencent.com/edgeone/makers> 開通 EdgeOne Pages（要實名認證，這是騰訊雲的硬性要求）。
3. 建專案 → **匯入 Git 倉庫** → 選你的 `answer-book`。
4. 建置設定：
   - **建置指令**：`npm run build`
   - **輸出目錄**：`out`
   - **環境變數**：`STATIC_EXPORT` = `true`、`BASE_PATH` = **留空**（重點：用自訂網域時網址在根目錄，不能加 `/answer-book`），再加上兩個 `NEXT_PUBLIC_SUPABASE_*`
5. **加速區域選「全球可用區（不含中國大陸）」** → 這一項**不需要工信部備案**，走香港與海外節點，國內可直連。
6. 綁定你的網域，等憑證簽發完就好了。

> **為什麼不選「中國大陸可用區」？** 那需要工信部備案（1–3 週、要實名、要國內主體）。想追求國內最快速度就走去備案；一般玩玩選「不含中國大陸」就夠。
>
> ⚠️ **EdgeOne Pages 免費版不能用系統配的 `*.edgeone.dev` 網址分享給別人。**（這是在中國大陸實測過的結論。）騰訊官方文件的規定是：
>
> | 加速區域 | 系統配的網址會怎樣 |
> | --- | --- |
> | 中國大陸可用區／全球可用區（含中國大陸） | 只能用**系統產生的預覽連結**開，該連結**只有 3 小時**有效，過期回 401；而且**綁自訂網域要工信部備案** |
> | **全球可用區（不含中國大陸）** ← 要選這個 | **中國大陸訪客訪問會直接回 401**；綁自訂網域**免備案** |
>
> **結論：不管選哪一個，系統配的網址都不能拿來分享。一定要綁自己的網域。**

#### 那個 401 要怎麼讀

在大陸打開系統配的 `*.edgeone.dev` 網址會看到 401，回應標頭是 `x-eop-msg: eo_time missing`。

**`eo_time` 是預覽連結的時間簽名，這個訊息只代表「你正在用一個需要簽名的預覽網址」，不能拿來判斷加速區域選對沒選對。**（我一開始看這個標頭就下了錯誤結論，記在這裡以免重蹈覆轍。）

要確認區域，看**項目設定 → 加速區域**，或看行為：

| 你的網路位置 | 區域＝不含中國大陸 | 區域＝含中國大陸 |
| --- | --- | --- |
| 中國大陸 | **401** ← 這是正常的，綁了自訂網域就會通 | 401（得改用預覽連結） |
| 其他地區 | 200 | 401（得改用預覽連結） |

也就是說：**只有從非大陸網路測到 200，才代表區域確實選了「不含中國大陸」。** 在大陸測到 401 並不能證明什麼。

#### 方案 B：域名備案 ＋ 國內雲（速度最快、最正規）

適合打算長期經營、在意國內速度的情況：

- 騰訊雲 EdgeOne Pages 加速區域選「**中國大陸可用區**」，或
- 阿里雲 OSS 靜態託管 ＋ CDN，或
- 騰訊雲 CloudBase 靜態託管

代價：域名要完成**工信部備案**（約 1–3 週，需實名、需國內主體），主機也要實名。

#### 方案 C：香港／境外輕量伺服器 ＋ 域名（免備案，但要自己管機器）

阿里雲香港輕量、騰訊雲香港 CVM 之類，一年幾百塊，域名不用備案。比方案 A 麻煩，除非你本來就想有一台伺服器。

### 6-3 不管放哪裡，程式碼都是同一套

這本答案之書是**純靜態**的——1000 條答案都在前端 `data/answers.json`，翻書抽籤全在瀏覽器完成，只有「記一筆到後台」才連 Supabase。所以任何靜態空間都能放。

`next.config.mjs` 用兩個環境變數控制：

| 環境變數 | 作用 |
| --- | --- |
| `STATIC_EXPORT=true` | 打開靜態匯出（產物在 `out/`）；不設就是正常的 Next.js 伺服器模式 |
| `BASE_PATH=/xxx` | 網址帶子路徑時才要設；用自訂網域（根目錄）就留空 |

| 平台 | `STATIC_EXPORT` | `BASE_PATH` |
| --- | --- | --- |
| 本機 `npm run dev` | 不設 | 不設 |
| GitHub Pages | `true` | `/answer-book` |
| EdgeOne Pages（自訂網域） | `true` | 留空 |
| 阿里雲 OSS / 七牛 | `true` | 留空 |
| Vercel | 不設 | 不設 |

想在本機先試靜態匯出：

```powershell
$env:STATIC_EXPORT="true"; $env:BASE_PATH=""; npm run build   # 產物在 out/
```

### 6-4 日常更新流程

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

### 6-5 改成 Vercel（可選）

Vercel 在國內不穩，但如果你只是要給海外朋友看、或想要更乾淨的網址，還是可以接：

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

> ⚠️ 在 Vercel 上**不要**設 `STATIC_EXPORT` 或 `BASE_PATH`。Vercel 走正常的 Next.js 模式，網址在根目錄。那兩個變數只存在於 GitHub workflow 裡，不會互相打架。

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
- **一筆一次翻頁**：每次按下「提问」只產生一筆記錄（已經沒有「再翻一次」了）。同一個人之後再問一次，會是獨立的一筆。
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
| 字體 | 字型檔在 `public/fonts/`，引用在 `app/layout.tsx` 的兩個 `<link>`；字型堆疊在 `globals.css` 的 `--font-serif` |
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
**已經處理好了，不需要你再做任何事。** 字型檔（Noto Serif SC ＋ Cormorant Garamond，共 111 個 woff2 切片、約 6MB）全部放在 `public/fonts/` 底下自己託管，訪客**完全不會**連到 `fonts.googleapis.com`。workflow 還有一道防線：產物中若出現 `fonts.googleapis.com` 或 `fonts.gstatic.com`，建置直接失敗。

瀏覽器只會下載「畫面上真的用到的字」所在的切片（實測首頁只載入 12/121 個 face），所以不會拖慢速度。CSS 裡也仍然保留 `宋体 / SimSun` 這類系統字型在堆疊後方，萬一字型檔沒載到，版面也不會壞。

要把字型換掉或重新抓，改 `app/layout.tsx` 的 `<link>` 指向你自己的 CSS 即可。

**Q：怎麼確認某個網址在大陸到底能不能開？**
用一條真實在中國大陸的線路實測。本專案在天津聯通（AS4837）上跑過一次校準，結果如下，可以當作對照基準：

| 測試目標 | 結果 | 解讀 |
| --- | --- | --- |
| google.com / youtube.com / facebook.com | 連線逾時 | 被牆（校準基準） |
| `fonts.googleapis.com` | **連線逾時** | **被牆** —— 所以字型一定要自託管 |
| `*.github.io` | **HTTP 200（368ms）** | **這條線路能開** |
| `*.supabase.co` | HTTP 401 | 連得到（401 只是沒帶 API key） |

兩點結論：

1. **`github.io` 的連通性因省份、運營商、時間而異。**天津聯通現在通，不代表廣東移動也通，也不代表下個月還通。這就是為什麼要另綁自訂網域走 EdgeOne。
2. **`fonts.googleapis.com` 時通時不通**（我們實測時第一次抓成功、幾分鐘後就逾時）。這正是不能依賴它的原因，也是為什麼產物一定要過「零 Google 連線」那道檢查。

---

## 授權與致謝

一千條答案為本專案原創撰寫，靈感來自 *The Book of Answers*（Carol Bolt）那類「隨手翻一頁就是答案」的占卜書傳統。
