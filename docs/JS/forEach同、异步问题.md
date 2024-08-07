通过本文你将学到：
- `forEach`是`异步执行`，内部用 `while`实现循环的，类似`for循环`简单粗暴；
- `for-in`、`for-of`是`同步执行`，内部用`迭代器`去实现的。

## forEach 是异步执行的

借用网上一个例子：

我们写代码的时候，希望代码能按照`arr`数组的顺序执行

```js
function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}

function test() {
	let arr = [3, 2, 1]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('结束')
}

test()
```

我们更希望上边的实行结果为：

```html
3
2
1
结束
```

但是，真实情况是

```js
结束
1
2
3
```

## 实现一个 forEach

我们自己简单`polyfill`一个 `forEach`，用`for`循环实现（据说查`mdn`源代码是用`while`循环实现，不过都一样）：

```js
const myForEach = function(fn) {
    let i
    for(i=0; i<this.length; i++){
       fn(this[i], i)
    }      
}
```

这里的`fn`函数就是我们例子中的 `async/await` 方法，`forEach`直接执行了`fn()`，而没有 await 就开始了下一次循环，或者换句话说，直接执行了`Promise的构造函数`部分代码，而`promise.then`代码没有被等待，就开始了下一次循环（执行下一个`Promise构造函数`的代码），而之前的`promise.then`都进入了`事件队列`，等循环结束后，再把所有`事件队列`里的任务拿出来执行，这就相当于同时发出去了好几个异步任务，哪个异步任务先执行完取决于自己执行多久。

比如，我们把数组的顺序`let arr = [3, 2, 1]`,改为`let arr = [3, 1, 2]`，再在构造函数里加一个`console.log('执行了构造函数', x)`，这样就能清楚的看到上面的解释了，

```js
function handle(x) {
	return new Promise((resolve, reject) => {
        console.log('执行了构造函数', x);
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}

function test() {
	let arr = [3, 1, 2]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('结束')
}

test();

// 执行了构造函数 3
// 执行了构造函数 1
// 执行了构造函数 2
// 结束
// Promise {<fulfilled>: undefined}
// 1
// 2
// 3
```
看执行结果你就懂了

## for of 是同步执行的

```js
function handle(x) {
	return new Promise((resolve, reject) => {
	    setTimeout(() => {
    	    resolve(x)
           }, 1000 * x)
	})
}

async function test() {
    let arr = [3, 2, 1]
    for(const item of arr) {
        const res = await handle(item)
        console.log(res)
    }
	console.log('结束')
}

test()
```

结果： 

```html
3
2
1
结束
```

因为`for...of`并不像`forEach`那么简单粗暴的方式去遍历执行，而是采用一种特别的手段——`迭代器` 去遍历。

```js
let arr = [3, 2, 1];
// 这就是迭代器
let iterator = arr[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// {value: 3, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}
```

好，现在我们把 iterator 用一到我们最开始的代码中；如下

```js
function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}

async function test() {
  let arr = [3, 2, 1]
  let iterator = arr[Symbol.iterator]();
  let res = iterator.next();
  while(!res.done) {
    let value = res.value;
    console.log(value);
    await handle(value);
    res = iterator.next();
  }
	console.log('结束')
}
test()
```

打印一下结果：

```html
// 3
// 2
// 1
// 结束
```

## 并行执行每一个Promise

```js
function handle(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(x)
            resolve(x)
           }, 1000 * x)
    })
}

async function test() {
    let arr = [3, 2, 1]
    

    await Promise.all(arr.map(handle));
    console.log('结束')
}

test()

// 1
// 2
// 3
// 结束
```

参考：

1. [forEach 和 for of 的执行异步顺序问题](https://juejin.cn/post/6844904129471463432)
2. [forEach 同/异步问题](https://blog.csdn.net/song854601134/article/details/124707324)
