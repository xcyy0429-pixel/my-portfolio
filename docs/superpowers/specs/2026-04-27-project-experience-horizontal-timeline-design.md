# Project Experience — 横向时间轴（方案 A）设计稿

## 目标

将网页中的「项目经历 Project Experience」模块（当前为 `src/components/Projects.jsx`）改造成 **高级感横向时间轴**，整体 **简洁、轻盈、科技感**，卡片采用 **glassmorphism**，并用 **一条连续的 SVG 波浪连接线** 连接 4 张卡片中心点。

## 范围

- **替换模块**：`src/components/Projects.jsx`（现 “Selected Projects / Things I've made”）
- **项目数据**：使用用户提供的 `projects`（4 条）
- **交互**：hover 上浮、发光增强、图标轻微缩放
- **动画**：section 进入视口后，卡片依次淡入并上浮（延迟 0.15s 递增）

## 不做的事

- 不引入复杂的 3D/Canvas 动画
- 不做横向滚动轮播（默认在桌面宽度可完整展示；小屏做降级布局）

## 视觉与布局（桌面端）

### 总体结构

- Section Header（标题 + 副标题）
- Timeline Wrapper（相对定位）
  - **连接线层**：绝对定位的 SVG（淡蓝色 + 轻微 glow）
  - **卡片层**：4 张卡片横向排列

### 卡片排列

- **4 张卡片横向排列**
- **上下错落**：第 1/3 张略高、第 2/4 张略低  
  - 通过 `translateY()` 实现：`[-18px, 18px, -12px, 20px]`（可微调）
- 卡片之间留足白（增强“高端轻盈”）

### 连接线（方案 A）

- 一条连续波浪线（SVG `<path>`），从第 1 张卡中心到第 4 张卡中心
- 线条样式：
  - 颜色：淡蓝 `rgba(120,160,255,0.55)`（或同等）
  - 主线 `stroke-width: 2`
  - glow 线：同 path 再画一条 `stroke-width: 10`，`opacity: 0.08` 做柔光
- 实现策略：
  - 用 wrapper 的宽度绘制 viewBox（例如 `0 0 1200 120`）
  - 通过 CSS 让 SVG 充满容器并覆盖在卡片中间高度

## 卡片内容结构

每张卡片（固定尺寸）：

- 顶部圆形图标（占位/简洁线性 icon）
- 项目名称
- 项目时间
- 两行项目简介（超出省略）
- 技术标签 pills（可折行）

## 样式规范（对齐用户要求）

- glassmorphism：
  - `backdrop-filter: blur(18px)`
  - `background: rgba(255,255,255,0.45)`
  - `border: 1px solid rgba(255,255,255,0.6)`
  - `box-shadow: 0 8px 30px rgba(31,38,135,0.08)`
- 圆角：`border-radius: 28px`
- 尺寸：`width: 280px; height: 420px`
- 发光边框：
  - 常态：`0 0 0 1px rgba(255,255,255,0.5), 0 0 20px rgba(120,160,255,0.08)`
  - hover：增强 glow + `translateY(-10px)` + 图标 `scale(1.06)`

## 文案与字号

- 主标题：`42px / 700 / #0f172a`
- 副标题：`18px / #64748b`
- 项目名：`24px / 600`
- 时间：`14px / #94a3b8`
- 描述：`15px / line-height 1.8`
- tags：`13px`，`padding: 6px 14px`，`radius: 999px`，背景 `rgba(255,255,255,0.7)`

## 动画（进入视口）

- 沿用项目现有的 IntersectionObserver 机制（`is-visible`）
- 每张卡：
  - 初始：`opacity: 0; transform: translateY(24px)`
  - 可见：`opacity: 1; transform: translateY(offsetY)`（保留错落）
  - 延迟：`i * 0.15s`

## 响应式（<= 900px）

- 降级为纵向堆叠（或横向可滚动二选一；默认选择纵向堆叠以保证可读）
- 隐藏/简化波浪线（避免小屏拉伸变形）
- 卡片宽度：`100%`，高度可自适应或保持 420px（视效果微调）

## TailwindCSS 说明

用户希望“React + TailwindCSS”，但当前项目 **未集成 Tailwind**（无 tailwind 配置与依赖）。实现上有两种路径：

- 方案 1（推荐就地改）：保持现有 CSS 体系（`Projects.css`）实现同样效果
- 方案 2（严格按要求）：正式引入 Tailwind（添加依赖与配置），然后用 Tailwind class 编写

本设计稿按 **视觉与交互目标** 描述，不绑定具体实现方式；落地时需要最终确认采用方案 1 还是方案 2。

