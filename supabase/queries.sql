-- ════════════════════════════════════════════════════════════════
--  答案之书 · 后台常用查询
--  用法：Supabase 控制台 → SQL Editor → 贴一条 → Run
--  （直接看原始数据的话：Table Editor → 选 readings 表）
-- ════════════════════════════════════════════════════════════════

-- 1. 最新 50 条：谁选了什么、问了什么、抽到什么
select
  created_at at time zone 'Asia/Shanghai' as 时间,
  category   as 关注方向,
  question   as 用户输入,
  answer_text as 抽到的答案,
  page_number as 页码
from public.readings
order by created_at desc
limit 50;


-- 2. 大家最关心什么：各方向占比
select
  category as 关注方向,
  count(*) as 提问次数,
  round(count(*) * 100.0 / sum(count(*)) over (), 1) as 占比百分比
from public.readings
group by category
order by 提问次数 desc;


-- 3. 每天的提问量 + 独立设备数
select
  created_at at time zone 'Asia/Shanghai' as 日期,
  count(*)                            as 提问次数,
  count(distinct user_agent)          as 独立设备数
from public.readings
group by 1
order by 1 desc;


-- 4. 大家都问了什么：相同问题出现次数排行
select
  question  as 用户输入,
  count(*)  as 被问了几次,
  min(category) as 方向
from public.readings
group by question
order by 被问了几次 desc, 用户输入
limit 50;


-- 5. 全文搜索：找包含某个词的提问
--    把 '分手' 换成你想搜的词
select
  created_at at time zone 'Asia/Shanghai' as 时间,
  category as 方向,
  question as 用户输入
from public.readings
where question ilike '%分手%'
order by created_at desc
limit 100;


-- 6. 哪些答案最常被翻到
select
  answer_text as 答案,
  count(*)    as 被抽中次数
from public.readings
group by answer_text
order by 被抽中次数 desc
limit 30;


-- 7. 按小时看活跃时段
select
  extract(hour from created_at at time zone 'Asia/Shanghai') as 小时,
  count(*) as 提问次数
from public.readings
group by 1
order by 1;


-- 8. 导出成 CSV
--    SQL Editor 的结果表格右上角有 Download CSV 按钮，跑这条再点它
select * from public.readings order by created_at desc;
