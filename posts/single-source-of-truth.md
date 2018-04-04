---
path: "/single-source-of-truth"
date: "2018-03-19"
title: "单一真实数据源与 React 受控组件"
author: "Leon"
tags: ["系统设计"]
dsct: ""
---


# 什么是单一真实数据源

> In information systems design and theory, single source of truth (SSOT), is the practice of structuring information models and associated schemata such that every data element is stored exactly once. 

以上一段描述摘自 [Wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth)。

# React 受控组件（Controlled Components）

我猜很多人在看完 React 文档关于受控组件部分的时候似乎明白了什么也似乎什么也没明白，然后就将他遗忘了。而且似乎在实际生产当中有意无意的会用到但是也并不会认真思考为什么要这样。最起码我就是这样的。

后来又开始再读文档时，文档中出现的一个字眼格外的引起了我的注意 `single source of truth`，或他那才是所谓为何要受控的原因。

> making the React state be the “single source of truth”.

对于一个表单组件而言，要完成两件事情：

1. 接收用户输入
2. 展示用户输入给用户

这就像是你在纸上绘画，你所看到的即是你所画的。

原生组件自己内部会存储用户的输入，但是在 React 组件中组件自身的可变状态是保持在 state 属性上的，我们想要对用户输入做一些事情并且将它推向全应用的话的话，我们必须将真实数据源从原生组件代理过来，将 React 的 state 作为单一数据来源。

1. onChange(({target.value}) => this.setState(value: value))
2. value={this.state.value}

这样一来对于表单组件而言他的 value 就完全被 state 所控制了。

那么这样做有什么用处呢，其实最大的用处就在 onChange 的回调函数里，我们可以任意的 map 这样一组输入来代替原有的表单。

就像是我们在玩游戏时，敲击键盘和鼠标我们眼睛看到的却是释放了一些技能。当然这些是给玩家看的，让玩家能够像做一件正常的事情一样完成游戏，但是在背后却是复杂的系统协同运算。这是就需要一个单一真实的数据源来将用户的输入推向整个系统。

``` js
// 来自官方的例子，这样看来无论用户是否开启了大写，但似乎也不是那么重要了。
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

# 回到单一真实数据源

上一个标题回顾了 React 受控组件。那么
