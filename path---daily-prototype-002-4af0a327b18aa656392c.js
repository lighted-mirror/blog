webpackJsonp([9716589766898],{335:function(n,e){n.exports={data:{markdownRemark:{html:"<p>本文将帮助你理解在 js 中为何参数传递是值传递的，并将会带你一起用 js 来实现一个引用传递变量的声明。</p>\n<hr>\n<p>一个测试同事让我给解释为什么 js 中参数传递是值传递，解释完之后，反倒对引用传递产生了兴趣。</p>\n<p>所以想要尝试使用 js 实现一下引用传递，当然开头先帮助 js 入门同学解释为何 js 参数传递是值传递。后面将会一点一点实现一个引用传递，或者说在两个变量之间建立具有破坏性的引用。</p>\n<br>\n<h2>为什么参数传递是值传递</h2>\n<p>首先我们先将函数调用时的一些小动作做分解：</p>\n<pre><code class=\"language-js\">function setName (_p, _name) {\n  _p.name = _name\n  _p = null\n}\nlet p = {name: null}\nsetName(p, 'leon')\np;\n// => {name: 'leon'}\n// 思考为什么 p 没有变成 null ?\n\n/**\n * 其实函数在调用时形参转化为实参时和下面这样是等效的\n */\nlet _p, _name;\n_p = p;\n_name = 'leon';\n_p = null;\n/**\n * 后面对 _p 进行重新赋值也仅仅改变的是 setName 函数执行环境中的变量 _p 的值而已，并不会影响父级环境的 p。\n * 到这里其实已经解释完了，但是我还是喜欢多问几个为什么，肯定有人也想过下面这种问题。\n */\nlet a = b = 1;\na = 0;\na; // => 0\nb; // => 1\n/**\n * 思考为什么 b 的值没有被改变，如果我想让他们完全绑定（引用传递）在一起该怎么办？\n * 就像是一个人真正拥有了两个名字，而不仅仅是复制一个（值传递），虽然听起来看起来都很奇怪。\n */\nlet a = b = 1;\na = 0;\na; // => 0\nb; // => 0\n</code></pre>\n<p>下面我将使用 js 着手实现一个引用传递，如果没有兴趣就可以关掉了，因为你已经知道了：</p>\n<blockquote>\n<p>在 js 中参数传递和赋值运算都是值传递的</p>\n</blockquote>\n<br>\n<h2>着手实现引用传递</h2>\n<p>下面是一些环境准备工作，需要一点的 <strong>ES</strong> 规范的基础，以及一些 ES6 的语法。如果不熟悉其实也不妨继续看下去。😎</p>\n<br> \n<h3>创建规范类型的类的定义</h3>\n<pre><code class=\"language-js\">/**\n * 用于实例化一个引用规范类型\n * 引用规范类型将被用来描述一个抽象引用关系\n * 由 name、discription 和 canReferenced 三部分组成\n * \n * @param  {String}  name           引用记录名称\n * @param  {Any}     discription    引用描述\n * @param  {Boolean} canReferenced  是否可以被引用传递,默认可以\n */\nclass Reference {\n  constructor (ro = {\n    name: '',\n    discription: undefined,\n    canReferenced: true\n  }) {\n    this.name = ro.name\n    this.canReferenced = ro.canReferenced === undefined ? true : ro.canReferenced\n    this['[[seter]]'](ro.discription)\n  }\n  /**\n   * 内部方法，设置引用描述\n   * @param  {Any}  disc  引用描述\n   */\n  '[[seter]]' (disc) {\n    if (disc instanceof Reference &#x26;&#x26; !disc.canReferenced) {\n      disc = disc['[[geter]]']()\n    }\n    if (this.discription instanceof Reference) {\n      this.discription['[[seter]]'](disc)\n    } else {\n      this.discription = disc\n    }\n  }\n  /**\n   * 内部方法，获取引用描述\n   */\n  '[[geter]]' () {\n    if (this.discription instanceof Reference) {\n      return this.discription['[[geter]]']()\n    } else {\n      return this.discription\n    }\n  }\n}\n\n/**\n * 获得引用规范类型的值\n * @param {Reference} v\n * @param {Boolean}   d  取址标志，是否获取原始引用类型，用于实现取址符‘&#x26;’\n */\nfunction GetValue (v, d) {\n  if (v instanceof Reference) {\n    return (d ? v : v['[[geter]]']())\n  } else {\n    console.error(new Error('TypeError: v is not a reference'))\n    return undefined\n  }\n}\n\n/**\n * 设置引用规范类型的值\n * @param {Reference} v\n */\nfunction PutValue (v, w) {\n  if (v instanceof Reference) {\n    return v['[[seter]]'](w)\n  } else {\n    console.error(new Error('TypeError: v is not a reference'))\n    return undefined\n  }\n}\n</code></pre>\n<p>上面在创建引用规范类型时减去了基值（base）和严格引用标识（strict reference），改为引用描述（discription），增加 <code>canReferenced</code> 作为是否可被引用传递的标识。因为下面的例子只单纯以赋值运算作为例子（基值在作为对象属性应用时会用到），希望能够简单快速的创建出引用规范类型。</p>\n<p>下面开始实现一个简单的环境记录用来存放这些引用。</p>\n<br>\n<h3>创建环境记录对象</h3>\n<p>由替换产生式：</p>\n<blockquote>\n<p>AssignmentExpression :</p>\n<p>LeftHandSideExpression = AssignmentExpression</p>\n</blockquote>\n<p>所得到记录项的所有可能的集合我们取名为<strong>引用范畴</strong>（随便取名~~），用以下对象 Rc （reference category）作为实例。</p>\n<pre><code class=\"language-js\">const RcPrototype = {\n  /**\n   * 添加引用记录项\n   * @param  {String}  name           引用记录名称，当为更改时无效\n   * @param  {Any}     discription    引用描述，实际的应用体，一个引用对象\n   * @param  {Boolean} isNewReference 尝试声明新变量标志\n   * @return {String}                 记录项的索引\n   */\n  put (name, reference, isNewReference) {\n    for(i in this) {\n      if(this[i].name === reference.name) {\n        if(isNewReference) {\n          console.error(new Error(`Identifier '${reference.name}' has already been declared`))\n        } else {\n          PutValue(this[i], GetValue(reference))\n          return i\n        }\n      }\n    }\n    this[name] = reference\n    return name\n  },\n  /**\n   * 获得引用记录项\n   * @param  {String} name 引用记录名称\n   * @return {Reference}   引用记录\n   */\n  get (name) {\n    for(i in this) {\n      if(this[i].name === name) {\n        return this[i]\n      }\n    }\n    console.error(new Error(`TypeError: ${name} is not defined`))\n  }\n}\n\nconst Rc = Object.create(RcPrototype)\n</code></pre>\n<p>到这里环境准备就完成了，下面我们来验证是否可以做到引用传递。</p>\n<br>\n<h3>测试运行</h3>\n<blockquote>\n<p>注释内容为 js 语法，紧跟着的是通过词法、语法解释器解释后执行的具体代码。</p>\n</blockquote>\n<pre><code class=\"language-js\">/**\n * 分别声明并初始化 p1, p2 两个变量\n * p1 允许被引用传递\n * p2 不允许被引用传递\n */\n\n// let p1 = 1;\nRc.put('c1', new Reference({\n  name: 'p1',\n  discription: 1\n}), true)\n// p1;\nGetValue(Rc.get('p1')) // => 1\n\n// let p2 = 2;\nRc.put('c2', new Reference({\n  name: 'p2',\n  discription: 2,\n  canReferenced: false\n}), true)\n// p2;\nGetValue(Rc.get('p2')) // => 2\n</code></pre>\n<p>下面将使用一个的新的语法 <code>&#x26;IdentifierName</code> 来获取变量的原始引用类型类，他是通过 <code>GetValue</code> 的第二个参数实现的。</p>\n<pre><code class=\"language-js\">/**\n * 声明 p3, p4 两个变量并分别引用 p1, p2 进行初始赋值\n */\n\n// let p3 = &#x26;p1;\nRc.put('c3', new Reference({\n  name: 'p3',\n  discription: GetValue(Rc.get('p1'), true)\n}), true)\n// p3;\nGetValue(Rc.get('p3')) // => 1\n\n// let p4 = &#x26;p2;\nRc.put('c4', new Reference({\n  name: 'p4',\n  discription: GetValue(Rc.get('p2'), true)\n}), true)\n// p4;\nGetValue(Rc.get('p4')) // => 2\n</code></pre>\n<pre><code class=\"language-js\">/**\n * 尝试改变 p3, p4 的值，测试能否影响到 p1, p2\n */\n\n// p3 = 0;\nRc.put('c5', new Reference({\n  name: 'p3',\n  discription: 0\n}))\n// p4 = 0;\nRc.put('c6', new Reference({\n  name: 'p4',\n  discription: 0\n}))\n// p1;\nGetValue(Rc.get('p1')) // => 0\n\n// p2;\nGetValue(Rc.get('p2')) // => 2\n\n/**\n * 最终尝试通过改变 p3 影响 p1，成功了，而通过改变 p4 影响 p2 失败了。\n * 原因是 p2 通过设置 canReferenced 属性拒绝了被引用传递。\n */\n</code></pre>\n<p>呐！一个简单的引用传递就实现了。看起来很不安全，但是非常有趣不是么？😉</p>\n<h1>完</h1>",frontmatter:{date:"November 28, 2017",title:"使用 js 实现引用传递",author:["Leon","https://github.com/jazzysnail"],tags:["JS"]}}},pathContext:{}}}});
//# sourceMappingURL=path---daily-prototype-002-4af0a327b18aa656392c.js.map