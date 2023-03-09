## 执行过程

`事件循环`的顺序，决定js代码的执行顺序：

1. 进入script，`整体代码`作为第一个宏任务后，开始第一次循环。
2. 接着执行所有的`微任务`。
3. 然后再次从`宏任务`开始，找到其中一个任务队列执行完毕，再执行所有的`微任务`。

听起来有点绕，看下面的例子：

```js
setTimeout(function() {
    console.log('宏任务2');
})

console.log('整体代码1');

new Promise(function(resolve) {
    console.log('整体代码2');
    resolve();
}).then(function() {
    console.log('微任务1');
}).then(function() {
    console.log('微任务2');
})

// 整体代码1
// 整体代码2
// 微任务1
// 微任务2
// Promise {<fulfilled>: undefined}
// 宏任务2

```
执行过程的拆解：
1. 这段代码作为宏任务，进入主线程
2. 先遇到`setTimeout`，将其回调函数注册后分发到宏任务。
3. 然后遇到了console，是`主线程`代码直接执行。
4. 接下来遇到了Promise，`new Promise`立即执行，then函数分发到微任务。
5. 好啦，整体代码script作为第一个宏任务执行结束，看看有哪些微任务？我们发现了then在微任务`微任务1`和`微任务2`里面，执行。
6. ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务开始。我们发现了宏任务中`setTimeout`对应的回调函数，立即执行。
7. 结束。

所以，`事件循环`，`宏任务`，`微任务`的关系如下图所示：

![](https://chao31.github.io/pics/img/202303071611044.png)


## 宏任务

|函数	|浏览器	|Node
| --- | --- | --- |
|setTimeout|✅  |✅  |
|setInterval|✅  |✅  |
|setImmediate|❌  |✅  |
|requestAnimationFrame|✅  |❌  |


## 微任务

|函数	 |浏览器	|Node
| --- | --- | --- |
|process.nextTick	|❌ 	|✅
|MutationObserver	|✅	|❌ 
|Promise.then catch finally	|✅	|✅

## 事件循环

javascript是一门`单线程`语言，所有的`多线程`都是用`单线程`模拟出来的。

可以把任务分为2类：同步任务和异步任务，我们常说的Event Loop(事件循环)就是如下过程：

1. `同步`和`异步`任务分别进入不同的执行"场所"，同步的进入`主线程`，异步的进入`Event Table`并注册函数。
2. 当指定的事情完成时，`Event Table`会将这个函数移入`Event Queue`。
3. `主线程`内的任务执行完毕为空，会去`Event Queue`读取对应的函数，进入`主线程`执行。
4. 上述过程会不断重复，也就是常说的Event Loop(事件循环)。如下图：

![](https://chao31.github.io/pics/img/202303071543546.png)

## 复杂的例子

这个例子看懂基本js执行机制就理解了

```js
//主线程直接执行
console.log('1');
//丢到宏事件队列中
setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
//微事件1
process.nextTick(function() {
    console.log('6');
})
//主线程直接执行
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    //微事件2
    console.log('8')
})
//丢到宏事件队列中
setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

- 首先浏览器执行js进入第一个宏任务进入主线程, 直接打印console.log('1')

- 遇到 setTimeout  分发到宏任务Event Queue中

- 遇到 process.nextTick 丢到微任务Event Queue中

- 遇到 Promise， new Promise 直接执行 输出 console.log('7');

- 执行then 被分发到微任务Event Queue中

- 第一轮宏任务执行结束，开始执行微任务 打印 6,8

- 第一轮微任务执行完毕，执行第二轮宏事件，执行setTimeout

- 先执行主线程宏任务，在执行微任务，打印'2,4,3,5'

- 在执行第二个setTimeout,同理打印 ‘9,11,10,12’

- 整段代码，共进行了三次事件循环，完整的输出为1，7，6，8，2，4，3，5，9，11，10，12。

以上是在浏览器环境下执行的数据，只作为宏任务和微任务的分析，我在node环境下测试打印出来的顺序为：1，7，6，8，2，4，9，11，3，10，5，12。node环境执行结果和浏览器执行结果不一致的原因是：浏览器的Event loop是在HTML5中定义的规范，而node中则由libuv库实现。libuv库流程大体分为6个阶段：timers，I/O callbacks，idle、prepare，poll，check，close callbacks，和浏览器的microtask，macrotask那一套有区别。

参考：

1. [js 宏任务和微任务](https://www.cnblogs.com/wangziye/p/9566454.html)
2. [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.cn/post/6844903512845860872)


