webpackJsonp([0xbc9f4f89a7e4],{551:function(n,s){n.exports={data:{markdownRemark:{html:'<p>一个测试同事让我给解释为什么 js 中参数传递是值传递，解释完之后，反倒对引用传递产生了兴趣。</p>\n<p>所以想要尝试使用 js 实现一下引用传递，当然开头先帮助 js 入门同学解释为何 js 参数传递是值传递。后面将会一点一点实现一个引用传递，或者说在两个变量之间建立具有破坏性的引用。</p>\n<h2>为什么参数传递是值传递</h2>\n<p>首先我们先将函数调用时的一些小动作做分解：</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">setName</span> <span class="token punctuation">(</span>_p<span class="token punctuation">,</span> _name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  _p<span class="token punctuation">.</span>name <span class="token operator">=</span> _name\n  _p <span class="token operator">=</span> <span class="token keyword">null</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">let</span> p <span class="token operator">=</span> <span class="token punctuation">{</span>name<span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">}</span>\n<span class="token function">setName</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span> <span class="token string">\'leon\'</span><span class="token punctuation">)</span>\np<span class="token punctuation">;</span>\n<span class="token comment">// => {name: \'leon\'}</span>\n<span class="token comment">// 思考为什么 p 没有变成 null ?</span>\n\n<span class="token comment">/**\n * 其实函数在调用时形参转化为实参时和下面这样是等效的\n */</span>\n<span class="token keyword">let</span> _p<span class="token punctuation">,</span> _name<span class="token punctuation">;</span>\n_p <span class="token operator">=</span> p<span class="token punctuation">;</span>\n_name <span class="token operator">=</span> <span class="token string">\'leon\'</span><span class="token punctuation">;</span>\n_p <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n<span class="token comment">/**\n * 后面对 _p 进行重新赋值也仅仅改变的是 setName 函数执行环境中的变量 _p 的值而已，并不会影响父级环境的 p。\n * 到这里其实已经解释完了，但是我还是喜欢多问几个为什么，肯定有人也想过下面这种问题。\n */</span>\n<span class="token keyword">let</span> a <span class="token operator">=</span> b <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\na <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\na<span class="token punctuation">;</span> <span class="token comment">// => 0</span>\nb<span class="token punctuation">;</span> <span class="token comment">// => 1</span>\n<span class="token comment">/**\n * 思考为什么 b 的值没有被改变，如果我想让他们完全绑定（引用传递）在一起该怎么办？\n * 就像是一个人真正拥有了两个名字，而不仅仅是复制一个（值传递），虽然听起来看起来都很奇怪。\n */</span>\n<span class="token keyword">let</span> a <span class="token operator">=</span> b <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\na <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\na<span class="token punctuation">;</span> <span class="token comment">// => 0</span>\nb<span class="token punctuation">;</span> <span class="token comment">// => 0</span>\n</code></pre>\n      </div>\n<p>下面我将使用 js 着手实现一个引用传递，如果没有兴趣就可以关掉了，因为你已经知道了：</p>\n<blockquote>\n<p>在 js 中参数传递和赋值运算都是值传递的</p>\n</blockquote>\n<br>\n<h2>着手实现引用传递</h2>\n<p>下面是一些环境准备工作，需要一点的 <strong>ES</strong> 规范的基础，以及一些 ES6 的语法。如果不熟悉其实也不妨继续看下去。😎</p>\n<br> \n<h3>创建规范类型的类的定义</h3>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">/**\n * 用于实例化一个引用规范类型\n * 引用规范类型将被用来描述一个抽象引用关系\n * 由 name、discription 和 canReferenced 三部分组成\n * \n * @param  {String}  name           引用记录名称\n * @param  {Any}     discription    引用描述\n * @param  {Boolean} canReferenced  是否可以被引用传递,默认可以\n */</span>\n<span class="token keyword">class</span> <span class="token class-name">Reference</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span> <span class="token punctuation">(</span>ro <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n    discription<span class="token punctuation">:</span> undefined<span class="token punctuation">,</span>\n    canReferenced<span class="token punctuation">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> ro<span class="token punctuation">.</span>name\n    <span class="token keyword">this</span><span class="token punctuation">.</span>canReferenced <span class="token operator">=</span> ro<span class="token punctuation">.</span>canReferenced <span class="token operator">===</span> undefined <span class="token operator">?</span> <span class="token boolean">true</span> <span class="token punctuation">:</span> ro<span class="token punctuation">.</span>canReferenced\n    <span class="token keyword">this</span><span class="token punctuation">[</span><span class="token string">\'[[seter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span>ro<span class="token punctuation">.</span>discription<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">/**\n   * 内部方法，设置引用描述\n   * @param  {Any}  disc  引用描述\n   */</span>\n  <span class="token string">\'[[seter]]\'</span> <span class="token punctuation">(</span>disc<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>disc <span class="token keyword">instanceof</span> <span class="token class-name">Reference</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>disc<span class="token punctuation">.</span>canReferenced<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      disc <span class="token operator">=</span> disc<span class="token punctuation">[</span><span class="token string">\'[[geter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>discription <span class="token keyword">instanceof</span> <span class="token class-name">Reference</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>discription<span class="token punctuation">[</span><span class="token string">\'[[seter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span>disc<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>discription <span class="token operator">=</span> disc\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">/**\n   * 内部方法，获取引用描述\n   */</span>\n  <span class="token string">\'[[geter]]\'</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>discription <span class="token keyword">instanceof</span> <span class="token class-name">Reference</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>discription<span class="token punctuation">[</span><span class="token string">\'[[geter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>discription\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/**\n * 获得引用规范类型的值\n * @param {Reference} v\n * @param {Boolean}   d  取址标志，是否获取原始引用类型，用于实现取址符‘&amp;’\n */</span>\n<span class="token keyword">function</span> <span class="token function">GetValue</span> <span class="token punctuation">(</span>v<span class="token punctuation">,</span> d<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>v <span class="token keyword">instanceof</span> <span class="token class-name">Reference</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>d <span class="token operator">?</span> v <span class="token punctuation">:</span> v<span class="token punctuation">[</span><span class="token string">\'[[geter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'TypeError: v is not a reference\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token keyword">return</span> undefined\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/**\n * 设置引用规范类型的值\n * @param {Reference} v\n */</span>\n<span class="token keyword">function</span> <span class="token function">PutValue</span> <span class="token punctuation">(</span>v<span class="token punctuation">,</span> w<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>v <span class="token keyword">instanceof</span> <span class="token class-name">Reference</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> v<span class="token punctuation">[</span><span class="token string">\'[[seter]]\'</span><span class="token punctuation">]</span><span class="token punctuation">(</span>w<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'TypeError: v is not a reference\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token keyword">return</span> undefined\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>上面在创建引用规范类型时减去了基值（base）和严格引用标识（strict reference），改为引用描述（discription），增加 <code>canReferenced</code> 作为是否可被引用传递的标识。因为下面的例子只单纯以赋值运算作为例子（基值在作为对象属性应用时会用到），希望能够简单快速的创建出引用规范类型。</p>\n<p>下面开始实现一个简单的环境记录用来存放这些引用。</p>\n<br>\n<h3>创建环境记录对象</h3>\n<p>由替换产生式：</p>\n<blockquote>\n<p>AssignmentExpression :</p>\n<p>LeftHandSideExpression = AssignmentExpression</p>\n</blockquote>\n<p>所得到记录项的所有可能的集合我们取名为<strong>引用范畴</strong>（随便取名~~），用以下对象 Rc （reference category）作为实例。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">const</span> RcPrototype <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">/**\n   * 添加引用记录项\n   * @param  {String}  name           引用记录名称，当为更改时无效\n   * @param  {Any}     discription    引用描述，实际的应用体，一个引用对象\n   * @param  {Boolean} isNewReference 尝试声明新变量标志\n   * @return {String}                 记录项的索引\n   */</span>\n  <span class="token function">put</span> <span class="token punctuation">(</span>name<span class="token punctuation">,</span> reference<span class="token punctuation">,</span> isNewReference<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">for</span><span class="token punctuation">(</span>i <span class="token keyword">in</span> <span class="token keyword">this</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>name <span class="token operator">===</span> reference<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span><span class="token punctuation">(</span>isNewReference<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`Identifier \'</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>reference<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\' has already been declared`</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n          <span class="token function">PutValue</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token function">GetValue</span><span class="token punctuation">(</span>reference<span class="token punctuation">)</span><span class="token punctuation">)</span>\n          <span class="token keyword">return</span> i\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> reference\n    <span class="token keyword">return</span> name\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">/**\n   * 获得引用记录项\n   * @param  {String} name 引用记录名称\n   * @return {Reference}   引用记录\n   */</span>\n  <span class="token keyword">get</span> <span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">for</span><span class="token punctuation">(</span>i <span class="token keyword">in</span> <span class="token keyword">this</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>name <span class="token operator">===</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`TypeError: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> is not defined`</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> Rc <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>RcPrototype<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>到这里环境准备就完成了，下面我们来验证是否可以做到引用传递。</p>\n<br>\n<h3>测试运行</h3>\n<blockquote>\n<p>注释内容为 js 语法，紧跟着的是通过词法、语法解释器解释后执行的具体代码。</p>\n</blockquote>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">/**\n * 分别声明并初始化 p1, p2 两个变量\n * p1 允许被引用传递\n * p2 不允许被引用传递\n */</span>\n\n<span class="token comment">// let p1 = 1;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c1\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p1\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token number">1</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token comment">// p1;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p1\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 1</span>\n\n<span class="token comment">// let p2 = 2;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c2\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p2\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n  canReferenced<span class="token punctuation">:</span> <span class="token boolean">false</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token comment">// p2;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p2\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 2</span>\n</code></pre>\n      </div>\n<p>下面将使用一个的新的语法 <code>&#x26;IdentifierName</code> 来获取变量的原始引用类型类，他是通过 <code>GetValue</code> 的第二个参数实现的。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">/**\n * 声明 p3, p4 两个变量并分别引用 p1, p2 进行初始赋值\n */</span>\n\n<span class="token comment">// let p3 = &amp;p1;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c3\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p3\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p1\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token comment">// p3;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p3\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 1</span>\n\n<span class="token comment">// let p4 = &amp;p2;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c4\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p4\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p2\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token comment">// p4;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p4\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 2</span>\n</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">/**\n * 尝试改变 p3, p4 的值，测试能否影响到 p1, p2\n */</span>\n\n<span class="token comment">// p3 = 0;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c5\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p3\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token number">0</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token comment">// p4 = 0;</span>\nRc<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">\'c6\'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'p4\'</span><span class="token punctuation">,</span>\n  discription<span class="token punctuation">:</span> <span class="token number">0</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token comment">// p1;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p1\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 0</span>\n\n<span class="token comment">// p2;</span>\n<span class="token function">GetValue</span><span class="token punctuation">(</span>Rc<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'p2\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// => 2</span>\n\n<span class="token comment">/**\n * 最终尝试通过改变 p3 影响 p1，成功了，而通过改变 p4 影响 p2 失败了。\n * 原因是 p2 通过设置 canReferenced 属性拒绝了被引用传递。\n */</span>\n</code></pre>\n      </div>\n<p>呐！一个简单的引用传递就实现了。看起来很不安全，但是非常有趣不是么？😉</p>\n<h1>完</h1>',frontmatter:{date:"March 18, 2018",path:"/es-reference",title:"值传递与引用传递",author:"Leon",dsct:"本文将帮助你理解在 js 中为何参数传递是值传递的，并将会带你一起用 js 来实现一个引用传递变量的声明。",tags:["JavaScript"]}}},pathContext:{}}}});
//# sourceMappingURL=path---es-reference-e83abe429b6855daad08.js.map