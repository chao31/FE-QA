## hash 模式

hash 路由模式的实现主要是基于下面几个特性

- 当向服务器端发出请求时，`hash` 部分不会被发送，`URL` 中 `hash` 值只是客户端的一种状态
- `hash` 值的改变，都会在浏览器的访问历史中增加一个记录。因此能通过浏览器的回退、前进按钮控制 `hash` 的切换；
- 可以通过 `a` 标签的点击使 URL 的 `hash` 值会发生改变；或者 `loaction.hash` 进行赋值，改变`hash` ；
- 使用 `hashchange` 事件来监听 `hash` 值的变化，从而对页面进行跳转（渲染）

```js
window.addEventListener("hashchange", funcRef, false);
```

特点：兼容性好但是不美观

## history 模式

- `history` 采用 `HTML5` 的新特性：`pushState()`，`replaceState()` （前者是新增一个历史记录，后者是直接替换当前的历史记录），以及 `popState` 事件的监听到状态变更
- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件，下面的 3 个才会触发
    - `window.history.back()` 后退
    - `window.history.forward()` 前进
    - `window.history.go(1)` 前进或者后退几步

特点：虽然美观，但是刷新会出现 404 需要后端进行配置

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