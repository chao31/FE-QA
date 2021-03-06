### 前端需要注意哪些 SEO

- 语义化的 HTML 代码，符合 W3C 规范，语义化代码让搜索引擎容易理解网页
- 提高网站速度：网站速度是搜索引擎排序的一个重要指标
- 非装饰性图片必须加 alt
- 合理的 `title`、`description`、`keywords`
  - 搜索对着三项的权重逐个减小，`title` 值强调重点即可，重要关键词出现不要超过 `2` 次，而且要靠前，不同页面 `title` 要有所不同。
  - `description` 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 `description` 有所不同。
  - `keywords` 列举出重要关键词即可。
- 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
- 重要内容不要用 js 输出：爬虫不会执行 js 获取内容
- 少用 iframe：搜索引擎不会抓取 iframe 中的内容

### SEO 优化

- 预渲染
- 服务端渲染 SSR

### 301 和 302 哪个对 SEO 更加友好

在大多數的情況之下，301 重定向網址或許是最適合你的重定向類型，因為 301 重定向轉址能確保能保護你的 SEO 排名不會在網站架構的更動中而失去。

### 301 或 302 选哪个重要吗？

用户无法察觉 301 和 302 的区别，两者在功能上是相同的。但你可能会想，这很重要吗？毕竟，

答案很简单：搜索引擎对待 301 重定向和 302 重定向的方式不同。并且，选择错误的重定向可能会导致 SEO 问题，而这些问题往往在数月甚至数年内被忽视。

#### 未使用重定向转址，旧网址和新网址同时存在，有什么不好？

- `重复内容`: google 不喜欢`重复内容`，因此当旧网址和新网址的内容相同时，且旧网址尚未被移除、新网址已经被收录的这段时间内，很有可能被 google 认定你的网址存在大量重复内容，会导致网址质量下降，最坏的情况可能受到排名的惩罚。
- `继承旧的 SEO 排名`：通过重定向，保留原始地址的 SEO 排名效果，让新网址能够`继承旧网址 SEO 排名`。