读完本文你将知道：

一般路由实现主要有 `history` 和 `hash` 两种方式：
- `hash` 的实现全部在前端，`不需要后端服务器配合`，兼容性好，主要是通过监听 `hashchange` 事件，处理前端业务逻辑
- `history` 的实现，`需要服务器做以下简单的配置`，通过监听 `pushState` 及 `replaceState` 事件，处理前端业务逻辑
   - `配置下 nginx`，告诉服务器，当我们访问的路径资源不存在的时候，默认指向静态资源 `index.html`
   - `webpack-dev-server` 配置：`historyApiFallback: true`

如果 `history` 模式下，前端和后端设置了同样的路由，会发生什么呢？
- 如果不刷新页面，走前端的路由，因为 URL 改变只是前端的变化，不会发起请求，就不会匹配到后端的路由
- 如果是直接刷新浏览器的 URL，就会向后台请求导致匹配到后台的路由

注意：如果选择了 `spa` 这种开发模式，那么理应来说，路由就是由前端控制了，如果后端有路由，那就是走 `MVC` 模式，不是我们的 `SPA` 模式了;后端的路由只是解决前端 404 问题


## SPA 单页面

如何理解`路由`的概念，其实还是要从`单页面`着手，进行剖析：

`单页面`，说白了，就是指我们的服务只有一个 `index.html` 静态文件，这个静态文件前端生成后，丢到服务器上面。用户访问的时候，就是访问这个静态页面。而静态页面中所呈现出来的所有交互，包括点击跳转，数据渲染等，都是在这个唯一的页面中完成的。


## hash 模式

hash 路由模式的实现主要是基于下面几个特性：

- `hash` 模式所有的工作都是在`前端`完成的，不需要`后端`服务的配合
- 实现方式：通过`hashchange`事件来监听 `URL` 中 `hash` 部分的变化，从而对页面进行跳转（渲染）

```js
window.addEventListener("hashchange", funcRef, false);
```

`特点：兼容性好，但是不美观`

改变 `hash` 的方式：

- `hash` 值的改变，都会在浏览器的访问历史中增加一个记录。因此能通过浏览器的回退、前进按钮控制 `hash` 的切换；
- 通过 `<a>标签</a>` 的点击改变`hash` 的值；或者 `loaction.hash` 进行赋值。

注意：当向服务器端发出请求时，`hash` 部分不会被发送，`URL` 中 `hash` 值只是客户端的一种状态



## history 模式

- `history` 采用 `HTML5` 的新特性：`pushState()`，`replaceState()` （前者是新增一个历史记录，后者是直接替换当前的历史记录），以及 `popState` 事件的监听到状态变更
- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件，下面的 3 个才会触发
    - `window.history.back()` 后退
    - `window.history.forward()` 前进
    - `window.history.go(1)` 前进或者后退几步

`特点：虽然美观，但是刷新会出现 404 需要后端进行配置`

### 如何监听 pushState 和 replaceState 的变化呢？

利用自定义事件 `new Event()` 创建这两个事件，并全局监听：

```html
<body>
  <button onclick="goPage2()">去 page2</button>
  <div>Page1</div>
  <script>
    let count = 0;
    function goPage2 () {
      history.pushState({ count: count++ }, `bb${count}`,'page1.html')
      console.log(history)
    }
    // 这个不能监听到 pushState
    // window.addEventListener('popstate', function (event) {
    //   console.log(event)
    // })
    function createHistoryEvent (type) {
      var fn = history[type]
      return function () {
        // 这里的 arguments 就是调用 pushState 时的三个参数集合
        var res = fn.apply(this, arguments)
        let e = new Event(type)
        e.arguments = arguments
        window.dispatchEvent(e)
        return res
      }
    }
    history.pushState = createHistoryEvent('pushState')
    history.replaceState = createHistoryEvent('replaceState')
    window.addEventListener('pushState', function (event) {
      // { type: 'pushState', arguments: [...], target: Window, ... }
      console.log(event)
    })
    window.addEventListener('replaceState', function (event) {
      console.log(event)
    })
  </script>
</body>
```

[参考](https://juejin.cn/post/7127143415879303204)