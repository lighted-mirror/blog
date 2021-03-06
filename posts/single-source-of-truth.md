---
path: "/single-source-of-truth"
date: "2018-03-19"
title: "单一真实数据源"
author: "Leon"
tags: ["系统设计", "理论与实践相结合"]
dsct: "single source of truth"
---


# 什么是单一真实数据源

> In information systems design and theory, single source of truth (SSOT), is the practice of structuring information models and associated data schema such that every data element is stored exactly once. Any possible linkages to this data element (possibly in other areas of the relational schema or even in distant federated databases) are by reference only. Because all other locations of the data just refer back to the primary "source of truth" location, updates to the data element in the primary location propagate to the entire system without the possibility of a duplicate value somewhere being forgotten.

以上一段关于单一真实数据源的描述摘自 [Wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth)。

大概意思是，单一真实数据源是被用在信息系统模型设计的理论方法。在系统中一个信息元将只被声明和存储一次，其他任何需要的信息元只存储该信息元的引用。这样做带来的好处就是当该信息元发生更新事件，那么将非常稳定的传播到所有链接的信息元无遗漏且可信赖。

其实这种思想的应用非常的广泛，大到数据库设计，小到一个变量的声明。

其实会发现我们的关系型数据库的设计不就是这样的么，我们抽象出实体和属性，然后尽可能不记录重复的数据，而是只存一次，然后通过关联表来进行计算。这样做不仅仅可以降低空间成本，而且能够保证数据的真实性。

在一个相对复杂的应用当中这种方法将非常的有用，例如一位用户的信息被展示在很多的地方，我们对于任何的地方的信息展示使用不同的接口返回来提供并不是上上策，而且你也无法保证接口的返回就一定是你想要的结果。这时如果你将系统中使用相同信息的地方的信息源均来自同一个地方，那么信息本身将高度的统一，而且你只需要关注真实数据源的更新就可以了。

再例如，我们想做一个带有复杂权限控制的系统，权限控制非常的细致，我们针将这些权限存储在一个地方，其他的控制点只需要利用高阶函数订阅权限的变更来返回一个布尔值来确定是否拥有该权限就好了。这样一来当权限发生变化我们将无需再做任何的事情，一切将顺其自然。

## Vue 计算属性（Computed）

当然同一信息又可能具有不同的形态，但是我们又必须要保证他的原始数据是相同的，Vue 推荐如果一个属性能够通过计算属性计算获得那么请使用计算属性，而不是重新声明一个。

## React 受控组件（Controlled Components）

我猜很多人在看完 React 文档关于受控组件部分的时候似乎明白了什么但也似乎什么也没明白，反正也不影响我使用是吧，然后就将他遗忘了。我当时就是这样的。

后来再读文档时，我发现了一个字眼 `single source of truth`。

> making the React state be the “single source of truth”.

对于一个表单组件而言，其实就是要完成两件事情：

- 接收用户输入
- 展示输入反馈

这就像是你在纸上绘画，你所看到的即是你所画的。

> 突然想到了乔布斯的设计哲学，finder 的图标一面是用户一面是机器，他们组合在一起组成了一张笑脸，finder 正是担当者这样一个角色。

原生组件自己内部会存储用户的输入，但是在 React 组件中组件自身的可变状态是保持在 `state` 属性上的，我们想要对用户输入做一些事情并且将它推向全应用的话的话，我们必须将真实数据源从原生组件代理过来，将组件中的 `state` 作为单一数据来源。

``` js
state = {
  value: ''
};

handleChange = event => {
  this.setState({value: event.target.value});
};
```

``` html
<input type="text" value={this.state.value} onChange={this.handleChange} />
```

`state.value` 作为真相源的存储，`props.value` 作为真相源的一个订阅者提供用户反馈；`onChange` 订阅用户输入更新真相源。

那么这样做有什么用处呢？有两个用处：

- 真实数据源在我们的组件手里满足我们应用框架的数据使用方式，可以方便提供给其他地方引用
- `onChange` 的回调函数里，我们可以对数据做一些事情

回调中对数据的处理有点像外观模式，模块内部的状态流转外部无需关心，模块只对外提供一整套的双向接口，内部将自动完成一些列的事情，外部只关心结果。

``` js
// 来自官方的例子，这样看来无论用户是否开启了大写，但似乎也不是那么重要了。
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

就像是我们在玩游戏时，敲击键盘和鼠标我们眼睛看到的却是释放了一些技能。当然这些是给玩家看的，让玩家能够像做一件正常的事情一样完成游戏，但是在背后却是复杂的系统协同运算。这时就需要一个单一真实的数据源来将用户的输入推向整个系统。

当然了，虽然在官方文档中受控组件是写在 `Forms` 这个版块下的，但是我觉得这个输入源可以是用户操作，也可以是一个接口返回等等，当一个系统基于这样一系列单一职责的处理单元组成时，将是非常的稳固的。

> Ps：文章可能只是当时的想法，可能当某一天思想会发生转变。

