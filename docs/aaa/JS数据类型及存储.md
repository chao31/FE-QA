## JS 内置类型

<embed src="https://chao31.github.io/pics/FE-QA/js-type.svg" type="image/svg+xml" />

`JavaScript` 一共有 8 种数据类型：

- 7 种基本数据类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Symbol`（es6 新增，表示独一无二的值）和 `BigInt`（es10 新增）
- 1 种引用数据类型：对象 Object（还包含`数组`、`正则对象`、`Date`、`Math`，`Function`）

JavaScript 不支持任何创建自定义类型的机制，而所有值最终都将是上述 8 种数据类型之一。

## 数据类型的存储

- 原始数据类型：存储在`栈`内存，被引用或拷贝时，会创建一个完全相等的变量，占据`空间小`、大小`固定`，属于被`频繁`使用数据，所以放入栈中存储。
- 引用数据类型：存储在`堆`内存，存储的是地址，多个引用指向同一个地址，占据`空间大`、大小`不固定`；当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## 为什么需要栈和堆两种空间

`JavaScript` 引擎需要用`栈`来维护程序执行期间`上下文`的状态，如果栈空间大了话，所有的数据都存放在栈空间里面，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。通常情况下，栈空间都不会设置太大，主要用来存放一些原始类型的小数据。

而引用类型的数据占用的空间都比较大，所以这一类数据会被存放到堆中，堆空间很大，能存放很多大的数据，不过缺点是分配内存和回收内存都会占用一定的时间。因此需要“栈”和“堆”两种空间。

## 检测数据类型

### typeof

`typeof` 对于原始类型来说，除了 `null` 都可以显示正确的类型

> 这个 `bug` 是第一版 Javascript 留下来的，javascript 中不同对象在底层都表示为二进制，而 javascript 中会把二进制前三位都为 0 的判断为 object 类型，而 null 的二进制表示全都是 0，自然前三位也是 0，所以执行 typeof 时会返回 object。</br>
</br>
</br>
<span style="position: absolute;bottom: 1rem;right: 1rem;">----引用自《你不知道的 javascript（上卷）》</span>

`typeof`在计算机底层是基于数据类型的值（二进制）进行检测

### Object.prototype.toString.call()

从下面这段代码可以看出，`Object.prototype.toString.call()` 可以很好地判断引用类型，甚至可以把 `document` 和 `window` 都区分开来。

```js
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('1')  // "[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"

Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // 同上结果，加上 call 也 ok

Object.prototype.toString.call([])       //"[object Array]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(Math)     // "[object Math]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call(function(){})  // "[object Function]"

// 区分 document 和 window
Object.prototype.toString.call(document)  //"[object HTMLDocument]"
Object.prototype.toString.call(window)   //"[object Window]"
```

### 实现一个全局通用的数据类型判断方法

```js
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行 typeof 判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于 typeof 返回结果是 object 的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');  // 注意正则中间有个空格
}
```

## 小结

- `JavaScript` 一共有 8 种数据类型，7+1
- 数据类型的存储：`栈`和`堆`，`栈`占据空间小、大小固定，被频繁使用；`堆`空间大、大小不固定
- 为什么需要栈和堆两种空间
  - `栈`分配小空间，若太大会影响上下文切换效率
  - `堆`存放大数据，缺点是分配内存和回收内存都会占用一定的时间
- `typeof`
  - 直接在计算机底层基于数据类型的值（二进制）进行检测
  - `typeof null`为`object` 原因是对象存在在计算机中，都是以 `000` 开始的二进制存储，所以检测出来的结果是对象
- 通用的数据类型判断方法: `typeof` + `toString`
