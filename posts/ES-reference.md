---
path: "/blog/es-reference"
date: "2018-03-18"
title: "使用 js 实现引用传递"
author: "leon"
dsct: "本文将帮助你理解在 js 中为何参数传递是值传递的，并将会带你一起用 js 来实现一个引用传递变量的声明。"
---

一个测试同事让我给解释为什么 js 中参数传递是值传递，解释完之后，反倒对引用传递产生了兴趣。

所以想要尝试使用 js 实现一下引用传递，当然开头先帮助 js 入门同学解释为何 js 参数传递是值传递。后面将会一点一点实现一个引用传递，或者说在两个变量之间建立具有破坏性的引用。

## 为什么参数传递是值传递

首先我们先将函数调用时的一些小动作做分解：

``` javascript
function setName (_p, _name) {
  _p.name = _name
  _p = null
}
let p = {name: null}
setName(p, 'leon')
p;
// => {name: 'leon'}
// 思考为什么 p 没有变成 null ?

/**
 * 其实函数在调用时形参转化为实参时和下面这样是等效的
 */
let _p, _name;
_p = p;
_name = 'leon';
_p = null;
/**
 * 后面对 _p 进行重新赋值也仅仅改变的是 setName 函数执行环境中的变量 _p 的值而已，并不会影响父级环境的 p。
 * 到这里其实已经解释完了，但是我还是喜欢多问几个为什么，肯定有人也想过下面这种问题。
 */
let a = b = 1;
a = 0;
a; // => 0
b; // => 1
/**
 * 思考为什么 b 的值没有被改变，如果我想让他们完全绑定（引用传递）在一起该怎么办？
 * 就像是一个人真正拥有了两个名字，而不仅仅是复制一个（值传递），虽然听起来看起来都很奇怪。
 */
let a = b = 1;
a = 0;
a; // => 0
b; // => 0
```

下面我将使用 js 着手实现一个引用传递，如果没有兴趣就可以关掉了，因为你已经知道了：

> 在 js 中参数传递和赋值运算都是值传递的

<br>

## 着手实现引用传递

下面是一些环境准备工作，需要一点的 __ES__ 规范的基础，以及一些 ES6 的语法。如果不熟悉其实也不妨继续看下去。😎

<br> 

### 创建规范类型的类的定义

``` js
/**
 * 用于实例化一个引用规范类型
 * 引用规范类型将被用来描述一个抽象引用关系
 * 由 name、discription 和 canReferenced 三部分组成
 * 
 * @param  {String}  name           引用记录名称
 * @param  {Any}     discription    引用描述
 * @param  {Boolean} canReferenced  是否可以被引用传递,默认可以
 */
class Reference {
  constructor (ro = {
    name: '',
    discription: undefined,
    canReferenced: true
  }) {
    this.name = ro.name
    this.canReferenced = ro.canReferenced === undefined ? true : ro.canReferenced
    this['[[seter]]'](ro.discription)
  }
  /**
   * 内部方法，设置引用描述
   * @param  {Any}  disc  引用描述
   */
  '[[seter]]' (disc) {
    if (disc instanceof Reference && !disc.canReferenced) {
      disc = disc['[[geter]]']()
    }
    if (this.discription instanceof Reference) {
      this.discription['[[seter]]'](disc)
    } else {
      this.discription = disc
    }
  }
  /**
   * 内部方法，获取引用描述
   */
  '[[geter]]' () {
    if (this.discription instanceof Reference) {
      return this.discription['[[geter]]']()
    } else {
      return this.discription
    }
  }
}

/**
 * 获得引用规范类型的值
 * @param {Reference} v
 * @param {Boolean}   d  取址标志，是否获取原始引用类型，用于实现取址符‘&’
 */
function GetValue (v, d) {
  if (v instanceof Reference) {
    return (d ? v : v['[[geter]]']())
  } else {
    console.error(new Error('TypeError: v is not a reference'))
    return undefined
  }
}

/**
 * 设置引用规范类型的值
 * @param {Reference} v
 */
function PutValue (v, w) {
  if (v instanceof Reference) {
    return v['[[seter]]'](w)
  } else {
    console.error(new Error('TypeError: v is not a reference'))
    return undefined
  }
}
```

上面在创建引用规范类型时减去了基值（base）和严格引用标识（strict reference），改为引用描述（discription），增加 `canReferenced` 作为是否可被引用传递的标识。因为下面的例子只单纯以赋值运算作为例子（基值在作为对象属性应用时会用到），希望能够简单快速的创建出引用规范类型。

下面开始实现一个简单的环境记录用来存放这些引用。

<br>

### 创建环境记录对象

由替换产生式：

> AssignmentExpression :
> 
> LeftHandSideExpression = AssignmentExpression

所得到记录项的所有可能的集合我们取名为__引用范畴__（随便取名~~），用以下对象 Rc （reference category）作为实例。

``` js
const RcPrototype = {
  /**
   * 添加引用记录项
   * @param  {String}  name           引用记录名称，当为更改时无效
   * @param  {Any}     discription    引用描述，实际的应用体，一个引用对象
   * @param  {Boolean} isNewReference 尝试声明新变量标志
   * @return {String}                 记录项的索引
   */
  put (name, reference, isNewReference) {
    for(i in this) {
      if(this[i].name === reference.name) {
        if(isNewReference) {
          console.error(new Error(`Identifier '${reference.name}' has already been declared`))
        } else {
          PutValue(this[i], GetValue(reference))
          return i
        }
      }
    }
    this[name] = reference
    return name
  },
  /**
   * 获得引用记录项
   * @param  {String} name 引用记录名称
   * @return {Reference}   引用记录
   */
  get (name) {
    for(i in this) {
      if(this[i].name === name) {
        return this[i]
      }
    }
    console.error(new Error(`TypeError: ${name} is not defined`))
  }
}

const Rc = Object.create(RcPrototype)
```

到这里环境准备就完成了，下面我们来验证是否可以做到引用传递。

<br>

### 测试运行

> 注释内容为 js 语法，紧跟着的是通过词法、语法解释器解释后执行的具体代码。

``` js
/**
 * 分别声明并初始化 p1, p2 两个变量
 * p1 允许被引用传递
 * p2 不允许被引用传递
 */

// let p1 = 1;
Rc.put('c1', new Reference({
  name: 'p1',
  discription: 1
}), true)
// p1;
GetValue(Rc.get('p1')) // => 1

// let p2 = 2;
Rc.put('c2', new Reference({
  name: 'p2',
  discription: 2,
  canReferenced: false
}), true)
// p2;
GetValue(Rc.get('p2')) // => 2
```

下面将使用一个的新的语法 `&IdentifierName` 来获取变量的原始引用类型类，他是通过 `GetValue` 的第二个参数实现的。

``` js
/**
 * 声明 p3, p4 两个变量并分别引用 p1, p2 进行初始赋值
 */

// let p3 = &p1;
Rc.put('c3', new Reference({
  name: 'p3',
  discription: GetValue(Rc.get('p1'), true)
}), true)
// p3;
GetValue(Rc.get('p3')) // => 1

// let p4 = &p2;
Rc.put('c4', new Reference({
  name: 'p4',
  discription: GetValue(Rc.get('p2'), true)
}), true)
// p4;
GetValue(Rc.get('p4')) // => 2
```

``` js
/**
 * 尝试改变 p3, p4 的值，测试能否影响到 p1, p2
 */

// p3 = 0;
Rc.put('c5', new Reference({
  name: 'p3',
  discription: 0
}))
// p4 = 0;
Rc.put('c6', new Reference({
  name: 'p4',
  discription: 0
}))
// p1;
GetValue(Rc.get('p1')) // => 0

// p2;
GetValue(Rc.get('p2')) // => 2

/**
 * 最终尝试通过改变 p3 影响 p1，成功了，而通过改变 p4 影响 p2 失败了。
 * 原因是 p2 通过设置 canReferenced 属性拒绝了被引用传递。
 */
```

呐！一个简单的引用传递就实现了。看起来很不安全，但是非常有趣不是么？😉

# 完
