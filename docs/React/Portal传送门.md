- 在以前，`react` 中所有的组件都会位于 `#app` 下，组件默认会按照既定层级嵌套渲染，而使用 `Portals` 提供了一种脱离 `#app` 的组件
- 因此 `Portals` 适合脱离文档流 (out of flow) 的组件（让组件渲染到父组件以外），特别是 `position: absolute` 与 `position: fixed` 的组件。比如模态框，通知，警告，goTop 等

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        // 正常渲染
        // return <div className="modal">
        //     {this.props.children} {/* 类似 vue slot */}
        // </div>

        // 使用 Portals 渲染到 body 上。
        // fixed 元素要放在 body 上，有更好的浏览器兼容性。
        return ReactDOM.createPortal(
            <div className="modal">{this.props.children}</div>,
            document.body // DOM 节点
        )
    }
}

export default App
```

```css
/* style.css */
.modal {
    position: fixed;
    width: 300px;
    height: 100px;
    top: 100px;
    left: 50%;
    margin-left: -150px;
    background-color: #000;
    /* opacity: .2; */
    color: #fff;
    text-align: center;
}
```