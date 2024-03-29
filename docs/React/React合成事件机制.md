
## 什么是 React 合成事件

> 为了解决跨浏览器兼容性问题，React 会将浏览器原生事件（Browser Native Event）封装为合成事件（SyntheticEvent）传入设置的事件处理器中。这里的合成事件提供了与原生事件相同的接口，不过它们屏蔽了底层浏览器的细节差异，保证了行为的一致性。另外有意思的是，React 并没有直接将事件附着到子元素上，而是以`单一事件监听器的方式将所有的事件发送到顶层进行处理`。这样 React 在更新 DOM 的时候就不需要考虑如何去处理附着在 DOM 上的事件监听器，最终达到优化性能的目的

- `React16`事件绑定到`document`上
- `React17`事件绑定到`root`组件上，有利于多个 react 版本共存，例如微前端
- React 里的`event`不是原生的，而是自己实现的`合成事件对象`——`SyntheticEvent`
- 若想操作原生`event`，通过`e.nativeEvent`

![](https://chao31.github.io/pics/img/202303181812326.png)

合成事件图示：

![](https://chao31.github.io/pics/img/202303181813466.png)

## 为何需要合成事件

- 更好的兼容性和跨平台，把 IE 和 W3C 标准之间的兼容问题给消除了
- 挂载到`document`或`root`上，减少内存消耗，避免频繁解绑

```js
// 获取 event
clickHandler3 = (event) => {
    event.preventDefault() // 阻止默认行为
    event.stopPropagation() // 阻止冒泡
    console.log('target', event.target) // 指向当前元素，即当前元素触发
    console.log('current target', event.currentTarget) // 指向当前元素，假象！！！

    // 注意，event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent 组合事件
    console.log('event', event) // 不是原生的 Event，原生的 MouseEvent
    console.log('event.__proto__.constructor', event.__proto__.constructor)

    // 原生 event 如下。其 __proto__.constructor 是 MouseEvent
    console.log('nativeEvent', event.nativeEvent)
    console.log('nativeEvent target', event.nativeEvent.target)  // 指向当前元素，即当前元素触发
    console.log('nativeEvent current target', event.nativeEvent.currentTarget) // 指向 document！！！

    // 1. event 是 SyntheticEvent，模拟出来 DOM 事件所有能力
    // 2. event.nativeEvent 是原生事件对象
    // 3. 所有的事件，都被挂载到 document 或`root` 上
    // 4. 和 DOM 事件不一样，和 Vue 事件也不一样
}
```