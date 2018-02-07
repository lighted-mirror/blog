webpackJsonp([46606309235019],{345:function(e,o){e.exports={data:{markdownRemark:{html:'<p>new 到底是怎么一回事呢？不如一起来实现以下。</p>\n<hr>\n<h2>Object</h2>\n<p>Object 的内部属性使用 [[Prototype]] 来表示对象的原型，在大多数的 js 内核的实现中使用 <code>__proto__</code> 属性，如 chrome。</p>\n<h2>Function</h2>\n<p>Function 的 实例属性 <code>prototype</code> 的值用于初始化一个新创建对象的的 [[Prototype]] 内部属性，为了这个新创建对象要先将函数对象作为构造器调用。这个属性拥有特性 { [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: false }。</p>\n<h2>Constructor</h2>\n<p>构造器的 <code>prototype</code> 属性值是一个原型对象，它用来实现继承和共享属性。</p>\n<h2>Prototype</h2>\n<p>当构造器创建一个对象，为了解决对象的属性引用，该对象会隐式引用构造器的 <code>prototype</code> 属性。通过程序表达式 <code>constructor.prototype</code> 可以引用到构造器的 <code>prototype</code> 属性，并且添加到对象原型里的属性，会通过继承与所有共享此原型的对象共享。另外，可使用 Object.create 内置函数，通过明确指定原型来创建一个新对象。</p>\n<h2>New</h2>\n<p>产生式 NewExpression : new NewExpression 按照下面的过程执行 :</p>\n<ol>\n<li>令 ref 为解释执行 NewExpression 的结果 .</li>\n<li>令 constructor 为 GetValue(ref).</li>\n<li>如果 Type(constructor) is not Object ，抛出一个 TypeError 异常 .</li>\n<li>如果 constructor 没有实现 [[Construct]] 内置方法 ，抛出一个 TypeError 异常 .</li>\n<li>返回调用 constructor 的 [[Construct]] 内置方法的结果 , 传入按无参数传入参数列表 ( 就是一个空的参数列表 ).</li>\n</ol>\n<p>产生式 MemberExpression : new MemberExpression Arguments 按照下面的过程执行 :</p>\n<ol>\n<li>令 ref 为解释执行 MemberExpression 的结果 .</li>\n<li>令 constructor 为 GetValue(ref).</li>\n<li>令 argList 为解释执行 Arguments 的结果 , 产生一个由参数值构成的内部列表类型 (11.2.4).</li>\n<li>如果 Type(constructor) is not Object ，抛出一个 TypeError 异常 .</li>\n<li>如果 constructor 没有实现 [[Construct]] 内置方法，抛出一个 TypeError 异常 .</li>\n<li>返回以 argList 为参数调用 constructor 的 [[Construct]] 内置方法的结果 .</li>\n</ol>\n<p><strong>Note:</strong> <code>NewExpression</code> 为对象创建表达式，<code>MemberExpression</code> 为成员表达式，<code>GetValue</code> 为引用规范类型获取具体值的方法，参看 ES 规范 __ 左值表达式__ 部分和 <strong>引用规范类型</strong> 部分。</p>\n<p>细心会发现，依据不同的产生式，步骤有一些差别。其实这个差别看起来就像是 <code>new Object</code> 和 <code>new Object(...argList)</code> 的差别，如果 <code>argList</code> 为空应该是无差别的。前面是构造器，其实就构造函数而言还有一种差别是 <code>Date()</code> 和 <code>new Date()</code> 的差别，可以通过在构造器内部使用 <code>instanceof</code> 操作符来进行安全类型检测，不多写。</p>\n<p>根据规范原理描述，我们大致可以以下步骤作为简单的实现：</p>\n<ol>\n<li>创建一个空对象</li>\n<li>绑定原型</li>\n<li>以 <code>argList</code> 为入参执行构造函数，函数 this 指向新的对象</li>\n<li>返回该对象</li>\n</ol>\n<p>简单书写一下：</p>\n<pre><code class="language-js">const _new = function (constructor, ...argList) {\n  let _object = new Object()\n  _object.__proto__ = constructor.prototype\n  constructor.call(_object, ...argList)\n  return _object\n}\n</code></pre>\n<pre><code class="language-js">let v = function (val) {\n  this.base = val2\n}\n\nv.prototype.getValue = function () {\n  return this.base\n}\n\n// NewExpression : new NewExpression\nconst _v = _new(v)\n// MemberExpression : new MemberExpression Arguments\nconst _vv = _new(v, 3)\n\n_v instanceof v // => true\n_vv instanceof v // => true\n</code></pre>\n<p>:完</p>',frontmatter:{date:"November 13, 2017",title:"New",author:["Leon","https://github.com/jazzysnail"],tags:["JS"]}}},pathContext:{}}}});
//# sourceMappingURL=path---fluent-design-system-4bae982b8731110eb15e.js.map