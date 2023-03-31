## 消灭回调函数

- `promise.then`链式调用，但也是基于回调函数
- `async/await`是同步语法，彻底消灭回调函数

## async/await和promise的关系

执行`async`函数，返回的是`promise`

```js
async function fn2() {
  return new Promise(() => {})
}
console.log( fn2() ) // Promise {<pending>}

async function fn1() {
  return 100
}

// 相当于 Promise.resolve(100)
console.log( fn1() ) // Promise {<fulfilled>: 100}
```

- `await`相当于`promise`的`then`
- `try catch`相当于`promise`的`catch`，可捕获异常，
- `await` 后面跟 `Promise` 对象：会阻断后续代码，等待状态变为 `fulfilled` ，才获取结果并继续执行
- `await` 后续跟非 `Promise` 对象：会直接返回

举例如下： 

### 例1，中断
```js
(async function () {
  const p1 = new Promise(() => {})
  await p1
  console.log('p1') // 不会执行
})()
```

`await p1`会中断，等待`p1`的状态改变，但`p1`一直处于pending状态，所以后面的console不会执行，但下面这样`console`就会执行

### 例2，等待后继续执行
```js
(async function () {
  const p1 = Promise.resolve(100)
  const res = await p1
  console.log(res) // 100
})()
```

### 例3，await一个非Promise对象
`await` 后续跟非 `Promise` 对象：会直接返回
```js
(async function () {
  const res = await 100
  console.log(res) // 100
})()
```

### 例4，await到了reject状态

```js
(async function () {
  const p3 = Promise.reject('some err') // rejected状态，不会执行下面的then
  const res = await p3 // await 相当于then
  console.log(res) // 不会执行
})()
```
`await` 相当于`then`，所以`reject`状态只会走到`try catch`里面，但没写，后面的代码就不会执行

### 例5，try/catch捕获rejected状态

```js
(async function () {
    const p4 = Promise.reject('some err')
    try {
      const res = await p4
      console.log(res)
    } catch (ex) {
      console.error(ex)
    }
})()
```

## 总结

- `async` 封装 `Promise`
- `await` 处理 `Promise` 成功
- `try...catch` 处理 `Promise` 失败

## async、await和微任务

`await` 是同步写法，但本质还是异步调用。await下面的代码，是放入callback回调中，相当于then

```js
async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end') // 关键在这一步，它相当于放在 callback 中，最后执行
  // 类似于Promise.resolve().then(()=>console.log('async1 end'))
}

async function async2 () {
  console.log('async2')
}

console.log('script start')
async1()
console.log('script end')

// 打印
// script start
// async1 start
// async2
// script end
// async1 end
```

看一个复杂的例子

```js
async function async1 () {
  console.log('async1 start') // 2
  await async2()

  // await后面的下面三行都是异步回调callback的内容
  console.log('async1 end') // 5 关键在这一步，它相当于放在 callback 中，最后执行
  // 类似于Promise.resolve().then(()=>console.log('async1 end'))
  await async3()
  
  // await后面的下面1行都是异步回调callback的内容
  console.log('async1 end2') // 7
}

async function async2 () {
  console.log('async2') // 3
}
async function async3 () {
  console.log('async3') // 6
}

console.log('script start') // 1
async1()
console.log('script end') // 4
```
即，只要遇到了 await ，后面的代码都相当于放在 callback(微任务) 里。

### 经典的面试题

```js
async function async1 () {
  console.log('async1 start')
  await async2() // 这一句会同步执行，返回 Promise ，其中的 `console.log('async2')` 也会同步执行
  console.log('async1 end') // 上面有 await ，下面就变成了“异步”，类似 cakkback 的功能（微任务）
}

async function async2 () {
  console.log('async2')
}

console.log('script start')

setTimeout(function () { // 异步，宏任务
  console.log('setTimeout')
}, 0)

async1()

new Promise (function (resolve) { // 返回 Promise 之后，即同步执行完成，then 是异步代码
  console.log('promise1') // Promise 的函数体会立刻执行
  resolve()
}).then (function () { // 异步，微任务
  console.log('promise2')
})

console.log('script end')

// 同步代码执行完之后，屡一下现有的异步未执行的，按照顺序
// 1. async1 函数中 await 后面的内容 —— 微任务（先注册先执行）
// 2. setTimeout —— 宏任务（先注册先执行）
// 3. then —— 微任务

// 同步代码执行完毕（event loop - call stack被清空）
// 执行微任务
// 尝试DOM渲染
// 触发event loop执行宏任务

// 输出
// script start 
// async1 start  
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

## forEach 和 async/await的问题

看下一篇