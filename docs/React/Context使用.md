## 什么是 Context

> 在平时工作中的某些场景下，你可能想在整个组件树中传递数据，但却不想手动地通过 `props` 属性在每一层传递属性，`contextAPI` 应用而生。

## 使用

### 1. 先创建 createContext

使用 `createContext` 创建并初始化

```js
// theme-context.js
export const C = createContext(defaultValue);
```

### 2. Provider 指定使用的范围

`祖先`组件使用`Provider`，通过 `value`属性 传入上下文

```js
<C.Provider value={{n, setN}}>
    这是爷爷
    <Father></Father>
</C.Provider>
```

### 3. 子组件接收上下文

#### 函数组件：使用`useContext` 或 `Context.Consumer`

- 使用 `useContext`，直接解构出`value`

    ```js
    const {n, setN} = useContext(C)；
    ```

- 使用`Context.Consumer`，里面需要一个函数作为子元素，函数的参数就是当前`context`

    ```js
    import {C} from './theme-context';

    function Child(){
        return(
            <C.Consumer>
    +            {(n, setN) => {
                    const add=()=> setN(n=>n+1);
                    return (
                        <div>
                            这是儿子:{n}
                            <button onClick={add}>点击加 1</button>
                        </div>
                    )
                }}
            </C.Consumer>
        )
    }
    ```

#### 类组件：使用`contextType`

- 指定`contextType`后，通过 `this.context` 获得上下文

```js
import {C} from './theme-context';

class Child extends React.Component {
    render() {
+       let {n, setN} = this.context;
        this.add= ()=> setN(n=>n+1);
        return (
            <div>
                这是儿子:{n}
                <button onClick={add}>点击加 1</button>
            </div>
        );
    }
}
+ Child.contextType = C;
```

## 完整的例子

```js
import React, { createContext, useContext, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'

// 创造一个上下文
const C = createContext(null);

function App(){
  const [n,setN] = useState(0)
  return(
    // 指定上下文使用范围，使用 provider，并传入读数据和写入据
    <C.Provider value={{n,setN}}>
      这是爷爷
      <Father></Father>
    </C.Provider>
  )
}

function Father(){
  return(
    <div>
      这是爸爸
      <Child></Child>
    </div>
  )
}

function Child(){
  // 使用上下文，因为传入的是对象，则接受也应该是对象
  const {n, setN} = useContext(C)
  const add=()=>{
    setN(n=>n+1)
  };
  return(
    <div>
      这是儿子:n:{n}
      <button onClick={add}>+1</button>
    </div>
  )
}


ReactDOM.render(<App />,document.getElementById('root'));
```
