---
path: "/usage-of-stack-in-program"
date: "2018-03-20"
title: "栈在程序中的常用方式"
author: "Leon"
dsct: "一些栈的基本应用"
tags: ["数据结构", "JavaScript"]
---

# 逆序输出问题

输出次序与处理过程颠倒

``` js
// 二进制转换
function convert (int64) {
  let baseStack = [];
  while (int64 > 0) {
    baseStack.push(int64 % 2);
    int64 = parseInt(int64 / 2);
  }
  return baseStack.reduce((pre, next) => (pre + `${next}`), '');
}
```

# 递归嵌套问题

处理过程具有自相似性可被递归描述，但递归深度不可预知

``` js
// 括号匹配问题
function paren(string) {
 const char = `${string}`;
  let stock = [];
  for (var i = 0; i < char.length; i++) {
    // 遇到左括号进栈
    if (char[i] == '(') {
      stock.push(char[i])
    // 遇到右括号比对栈顶选择弹出或终止迭代
    } else if (char[i] == ')') {
      if(stock[stock.length - 1] === '(') {
        stock.pop();
      } else {
        stock.push(char[i])
        break;
      }
    }
  }
  // 栈空当且仅当匹配
  return !stock.length;
}
```

# 延迟缓冲

中缀表达式求值问题

# 栈式计算

> Ps：未完待续
