---
theme: devui-blue
highlight: atelier-cave-light
---
## 引入 package
只需引入`react-router-dom`一个包即可，不再需要引入`react-router`，因为`react-router`的所有 api 都在`react-router-dom`内，如：
```js
- import { generatePath } from 'react-router';
- import { renderRoutes } from 'react-router-config';

// useRoutes 替换了 renderRoutes
+ import { generatePath, useRoutes } from 'react-router-dom';
```
 `react-router-native`同理

## 五种路由类型
* [`<BrowserRouter>`](https://reactrouter.com/docs/en/v6/api#browserrouter) or [`<HashRouter>`](https://reactrouter.com/docs/en/v6/api#hashrouter) - 用于 web
* [`<StaticRouter>`](https://reactrouter.com/docs/en/v6/api#staticrouter)  - 用于服务端渲染
* [`<NativeRouter>`](https://reactrouter.com/docs/en/v6/api#nativerouter) - 用于 [React Native](https://reactnative.dev/) 
* [`<MemoryRouter>`](https://reactrouter.com/docs/en/v6/api#memoryrouter) - 一般用于写测试用例
* [`<unstable_HistoryRouter>`](https://reactrouter.com/docs/en/v6/api#unstable_historyrouter) - 用于需要  [`history 实例`](https://github.com/remix-run/history) 的地方

## 两种使用方式
Routing 作用：定义了渲染哪些 React elements，以及父元素包裹哪些子元素，一共有如下两种：
-   [`<Routes>` + `<Route>`](https://reactrouter.com/docs/en/v6/api#routes-and-route) 
-   [`useRoutes`](https://reactrouter.com/docs/en/v6/api#useroutes) 
<details>

```js
// 方式一
<Routes>
  <Route path="/" element={<Dashboard />}>
    <Route path="messages" element={<DashboardMessages />} />
    <Route path="tasks" element={<DashboardTasks />} />
  </Route>
</Routes>

// 方式二
const routes = [{
  path: "/",
  element: <Dashboard />,
  children: [
    { 
        path: "tasks", 
        element: <DashboardTasks /> 
    },
  ],
}];
useRoutes(routes);
```
</details>

*备注：`React Router v5`用的是`renderRoutes`
```js
// React Router v5
import { renderRoutes } from 'react-router-config';
// React Router v6
import { useRoutes } from "react-router-dom";
```

## 两种页面跳转
有如下 2 种方式修改当前 [location](https://reactrouter.com/docs/en/v6/api#location)
* [`<Link>`](https://reactrouter.com/docs/en/v6/api#link) and [`<NavLink>`](https://reactrouter.com/docs/en/v6/api#navlink) - 都是 react 里的 a 标签，`<NavLink>`比`<Link>`多了`isActive`属性，知道是否处于`active`状态
* [`useNavigate`](https://reactrouter.com/docs/en/v6/api#usenavigate) and [`<Navigate>`](https://reactrouter.com/docs/en/v6/api#navigate) - 相当于`window.location.href`跳转，`useNavigate`在组件的 hook 里用，`<Navigate>`在 jsx 的 dom 里用

## Search 参数

useSearchParams - 相当于[URL.searchParams](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)的 api 
```js
let [searchParams, setSearchParams] = useSearchParams();
```

## API 指引

### Outlet

`<Outlet>`放在父元素中，这样被父元素包裹的子元素，就能被展示出来

<details>

`/`是父元素，对应的元素为`<App />`

```js
<Routes>
  <Route path="/" element={<App />} >
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />} />
  </Route>
</Routes>
```

父元素`<App />`不加`<Outlet>`，子元素`<Expenses />`和`<Invoices />`就不会被展示

```js
export default function App() {
  return (
    <div>
      <h1>Bookkeeper</h1>
      <nav >
        <Link to="/invoices">Invoices</Link> |{' '}
        <Link to="/expenses">Expenses</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```
</details>

## 未完待续。。。

