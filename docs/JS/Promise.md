## 为什么出现 Promise
`异步操作`以`同步操作`的流程表达出来，避免了回调函数的层层嵌套，解决了`地狱回调`问题

## Promise 的 2 个特点

1. `三种`状态。 `Pending`(进行中)、`Resolved`（已完成，又叫 Fulfilled）和 `Rejected`（已失败）
2. 状态`不可逆`。一旦状态改变，就不会再变，

## Promise 的 3 个缺点

1. `无法取消`问题。`Promise`一旦新建，就会立即执行，无法中途取消。
2. `错误外抛`问题。如果不设置`回调函数`，Promise 内部抛出的`错误`不会反应到`外部`。
3. `Pending内部状态`问题。在`Pending`状态时，不能进一步知道处于哪个状态（`刚开始`还是`即将完成`）。

## 状态的表现和变化

只有`异步的结果`(Pending) 才能决定当前是哪一种`状态`(Resolved 或 Rejected)，其它`任何操作`都不能改变这个状态。

- `pending`状态，不会触发`then`和`catch`
- `fulfilled`状态会触发后续的`then`回调
- `rejected`状态会触发后续的`catch`回调

## 常用函数

### Promise

Promise 构造函数接受一个函数作为参数，该函数有两个参数 resolve 和 reject
```js
var promise = new Promise(function(resolve, reject) {
    if('成功') {
        resolve();
    } else {
        reject();
    }
})
```

### then

`then`方法可以接受 2 个`回调函数`作为参数，第一个回调函数是`resolved`时调用，而第二个是`rejected`时调用（第二个`可选`，可不传）

```js
promise1
  .then(
    function success (res) {
      throw new Error('error')
    }, 
    function fail (e) {
      console.error('fail: ', e)
    }
  );
// promise1 里执行了 resolve，则执行 then 第 1 个参数的函数 sucess；
// promise1 里执行了 reject，则执行 then 第 2 个参数的函数 fail；
```

### catch

1. 链式调用里，`catch`前面的异步操作方法 (如`then`) 出现错误，其状态就会变成`rejected`，就会调用`catch`处理错误
2. `catch`其实就是`then`，`.catch(funcB)` 等价于 `.then(null, funcB)`
3. 所以`promise`后面跟的链式调用方法，可以看做都是`then`，只不过真正的`then`的状态由前面的`Promise构造函数`决定`resolve()`还是`reject()`；而`catch`这种`then`由前面的异步操作决定，报错则自动变成`reject()`，否则直接跳过`catch`

看看下面关于 catch 的题目

```js
var p1 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('出错了')), 3000);    
});
var p2 = new Promise((resolve, reject) => {
    setTimeout(() => {resolve(p1)}, 1000);
});
p2.then(result => console.log('then:', result));
p2.catch(error => console.log('catch:', error));

// catch: Error: 出错了
```
`p2`在 1 秒的时候，调用`resolve`方法，但其状态由`p1`决定，但此时`p1`的状态还没有改变，因此`p2`也不变。再等 2 秒，`p1`变为`rejected`，`p2`准备执行`resolve(p1)`，但里面的参数`p1`就报错了，根据第 3 条，`p2`前面的异步操作报错会自动变成`reject()`状态，所以这时的`p2`直接走`catch`。

### race

### all

## 10 道题理解 Promise

### 题目 1
```js
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)

// 1 2 4 3
```
搞清楚`宏任务`和`微任务`的执行顺序（先`宏任务`，再`微任务`，以此循环...）

1. 典型的微任务： `Promise`、`process.nextTick`
2. 典型的宏任务：`setTimeout`

### 题目 2
```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})

console.log('promise1', promise1)
console.log('promise2', promise2)

setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)


// promise1 Promise {<pending>}
// promise2 Promise {<pending>}
// Uncaught (in promise) Error: error!!!
// promise1 Promise {<fulfilled>: 'success'}
// promise2 Promise {<rejected>: Error: error!!!at <anonymous>:7:9}
```

### 题目 3
```js
const promise = new Promise((resolve, reject) => {
  resolve('success1')
  reject('error')
  resolve('success2')
})

promise
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })

// then:  success1
```
为什么连续调用了`resolve()`、`reject()`、`resolve()`3 次，只有第 1 个会执行？

- 从源码中可以看到，不管是 `resove` 还是 `reject`，只有`value==='pedding'`,才会执行，而第一次的 `resolve()` 已经把状态置成了`fulfilled`，不再是`pedding`，代码如下：
```js
const resolve = value => {
  
  setTimeout(() => {
    // 只有状态是 PENDING，才会执行后续
    if (this.state === PENDING) {
      ...
    }
  });
};
```

### 题目 4
```js
Promise.resolve(1)
  .then((res) => {
    console.log(res)
    return 2
  })
  .catch((err) => {
    return 3
  })
  .then((res) => {
    console.log(res)
  })

// 1
// 2
```

### 题目 5
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once')
    resolve('success')
  }, 1000)
})

const start = Date.now()
promise.then((res) => {
  console.log(res, Date.now() - start)
})
promise.then((res) => {
  console.log(res, Date.now() - start)
})

// once
// success 1010
// success 1010

```

两个`then`没有 return 一个`返回值`，所以会把最开始的`success`一直透传下去

### 题目 6
```js
Promise.resolve()
  .then(() => {
    return new Error('error!!!')
  })
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })

// then:  Error: error!!!
```

因为没有`throw`一个`error`，而是`return`了一个`error`，`return new Error('error!!!')`，相当于 return 一个字符串，所以走到了后面的`then`而没有走到`catch`里去。

如果`return new Error('error!!!')`改成`throw new Error('error!!!')`，就会走到`catch`里。

### 题目 7.
```js
const promise = Promise.resolve()
  .then(() => {
    return promise
  })
promise.catch(console.error)

```
循环引用

### 题目 8.
```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

```
promise 的透传，首先 1 传了第一个 then，但 then(fn) 函数期待参数 fn 是个函数，但确传了个数值 2，所以 promise 会如封装一个函数`return (p) => p`,这里 p 是 1，所以就会一直之执行 resove(1) 透传下去

### 题目 9
```js
Promise.resolve()
  .then(
    function success (res) {
      throw new Error('error')
    }, 
    function fail1 (e) {
      console.error('fail1: ', e)
    })
  .catch(function fail2 (e) {
    console.error('fail2: ', e)
  })

/*
fail2:  Error: error
    at success (<anonymous>:3:11)
*/
```
`then`方法可以接受 2 个`回调函数`作为参数，第一个回调函数是`resolved`时调用，而第二个是`rejected`时调用（第二个`可选`，可不传）

### 题目 10
```js
Promise.resolve()
  .then(function success (res) {
    throw new Error('error')
  })
  .catch(function fail1 (e) {
    console.error('fail1: ', e)
  })
  .catch(function fail2 (e) {
    console.error('fail2: ', e)
  })

/*
fail1:  Error: error
    at success (<anonymous>:3:11)
*/
```


