---
path: "/instructions-of-post"
date: "2018-03-19"
title: "推文说明"
author: "Leon"
dsct: "这将使我们的文档更美观更易于阅读"
tags: ["官方"]
---

# 推文分支

> 目前在开发阶段未单独拉取推文分支，未来会拉取。提交文章到 _jazzysnail@outlook.com_。

# Markdown 文档信息

文档信息语法如下：
``` text
---
path: "/format"
date: "2018-03-19"
title: "推文说明"
author: "Leon"
dsct: "这将使我们的文档更美观更易于阅读"
tags: ["官方"]
---
```

__PS:__ `dsct` 和 `tags` 字段可以不声明，其中 `dsct` 用于捕捉文章的描述，如果未声明则自动摘抄 50 字。`author` 字段在系统运行编译时将自动创建作者对应的 `tag` 到 `tags` 所以作者将无需再次声明作者标签，作者标签将以特殊的颜色显示（默认为蓝色）。

# 优化阅读

这一部分将给予一定优化阅读的风格指南，来保证我们文章的可读性。使读者可以将关注点放在文章的思想表达上不被糟糕的排版所影响，轻松的完成高质量的阅读。为此我们将不懈努力。

## 代码块

- 使用 markdown 代码块时必须指认代码所用语言，用于自动化语言识别。
- 代码块上下必须保留空行，保证与其他语法保持隔离。

## 留白（盘古之白）

### 中英语言切换之间

__Good:__
> 我是 Leon 的表弟，PHP 是世界上最好的语言。

__Bad:__
> 我是Leon本人，Java才是。

---

### 数字与单位之间

__Good:__
> 这个方法的执行耗时 20 ms。

__Bad:__
> 这个方法执行时创建了10mb的执行空间。

---

### 中文链接之间

当然这里在语法渲染时已经经过了处理，但是依然建议在进行原文书写是保留空格提升个人书写时的体验。

__Good:__
> 这里是我的 [个人博客](http://jazzysnail.me) 欢迎往来。

---

### 在这些地方你不应该留白

- 以全角形式标点之前和之后没有额外的空格。

## 标点

### 避免重复标点符号

__Good:__
> 太棒啦！

__Bad:__
> 反杀？？？

---

### 中文文章使用全角标点

__Good:__
> 我可爱么？喵~

__Bad:__
> 死基佬,滚!

---

### 英文整句使用半角标点

__Good:__
> The "black mirror" of the title is the one you'll find on every wall, on
 every desk, in the palm of every hand: the cold, shiny screen of a TV, a
 monitor, a smartphone.

__Bad:__
> The ”black mirror“ of the title is the one you‘ll find on every wall，on
 every desk，in the palm of every hand：the cold，shiny screen of a TV，a
 monitor，a smartphone。

### 使用完整名词，避免行业语言

__Good:__
> 我们需要一位熟悉 JavaScript、HTML5，至少理解一种框架（如 Vue、AngularJS、React 等）的前端开发者。

__Bad:__
> 我们需要一位熟悉 js、h5，至少理解一种框架（如 vue、angular、react 等）的前端开发者。

## 参考文献
- [中文文案排版指北](https://sparanoid.com/note/chinese-copywriting-guidelines/)
