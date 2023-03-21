## http状态码

- `1XX`：信息状态码
  - `100` Continue 继续，一般在发送`post`请求时，已发送了`http header`之后服务端将返回此信息，表示确认，之后发送具体参数信息
- `2XX`：成功状态码
  - `200` OK 正常返回信息
  - `201` Created 请求成功并且服务器创建了新的资源
  - `202` Accepted 服务器已接受请求，但尚未处理
- `3XX`：重定向
  - `301` Moved Permanently 永久重定向。
  - `302` Found 临时性重定向。
  - `303` See Other 临时性重定向，且总是使用 GET 请求新的 URI。
  - `304` Not Modified 自从上次请求后，请求的网页未修改过。
- `4XX`：客户端错误
  - `400` Bad Request 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
  - `401` Unauthorized 请求未授权。
  - `403` Forbidden 禁止访问。
  - `404` Not Found 找不到如何与 URI 相匹配的资源。
- `5XX`: 服务器错误
  - `500` Internal Server Error 最常见的服务器端错误。
  - `503` Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）。

### 常见状态码

- `200` 成功
- `301` 永久重定向（配合location，浏览器自动处理）
- `302` 临时重定向（配合location，浏览器自动处理）
- `304` 资源未被修改
- `403` 没有权限访问，一般做权限角色
- `404` 资源未找到
- `500` `Internal Server Error`服务器内部错误
- `502` `Bad Gateway`
- `503` `Service Unavailable`
- `504` `Gateway Timeout`网关超时

### 502 与 504 的区别

这两种异常状态码都与网关 `Gateway` 有关，首先明确两个概念

-`Proxy (Gateway)`，反向代理层或者网关层。在公司级应用中一般使用 `Nginx` 扮演这个角色
- `Application (Upstream server)`，应用层服务，作为 `Proxy` 层的上游服务。在公司中一般为各种语言编写的服务器应用，如 `Go/Java/Python/PHP/Node` 等

此时关于 `502` 与 `504` 的区别就很显而易见

- `502` `Bad Gateway`：一般表现为你自己写的「应用层服务(`Java/Go/PHP`)挂了」，或者网关指定的上游服务直接指错了地址，网关层无法接收到响应
- `504` `Gateway Timeout`：一般表现为「应用层服务 (`Upstream`) 超时，超过了 `Gatway` 配置的 `Timeout`」，如查库操作耗时三分钟，超过了 `Nginx` 配置的超时时间

## http headers

### 常见的Request Headers
- `Accept` 浏览器可接收的数据格式
- `Accept-Enconding` 浏览器可接收的压缩算法，如gzip
- `Accept-Language` 浏览器可接收的语言，如zh-CN
- `Connection:keep-alive` 一次TCP连接重复复用
- `Cookie`
- `Host` 请求的域名是什么
- `User-Agent`（简称UA） 浏览器信息
- `Content-type` 发送数据的格式，如application/json

### 常见的Response Headers
- `Content-type` 返回数据的格式，如application/json
- `Content-length` 返回数据的大小，多少字节
- `Content-Encoding` 返回数据的压缩算法，如gzip
- `set-cookie`

```js
Set-Cookie:value [ ;expires=date][ ;domain=domain][ ;path=path][ ;secure]
```

### 缓存相关的Headers
- `Cache Control`、`Expired`
- `Last-Modified` 和 `If-Modified-Since`
- `Etag` 和 `If-None-Match`

## HTTP协议1.0和1.1和2.0的区别

- `HTTP1.0`
  - 最基础的HTTP协议
  - 支持基本的`GET`、`POST`方法
- `HTTP1.1`
  - 缓存策略 `cache-control`、 `E-tag` 
  - 支持长链接 `Connection:keep-alive` 一次TCP连接多次请求
  - 断点续传，状态码206
  - 支持新的方法 `PUT` `DELETE`等，可用于`Restful API`写法
- `HTTP2.0`
  - 可压缩`header`，减少体积
  - 多路复用，一次TCP连接中可以多个HTTP并行请求
  - 服务端推送（实际中使用`websocket`）

注意：`Cache-Control`是`http 1.1`为了弥补 `Expires` 缺陷新加入的（`Expires`受限于本地时间，如果修改了本地时间，可能会造成缓存失效）

## HTTP协议和UDP协议有什么区别

- `HTTP`是应用层，`TCP`、`UDP`是传输层
- `TCP`有连接（三次握手），有断开（四次挥手），传输`稳定`
- `UDP`无连接，无断开，`不稳定`传输，但效率高。如视频会议、语音通话

## HTTP协议和WebSocket协议有什么区别

`WebSocket`特点: 
- 支持`端对端`通信
- 可由`client`发起，也可由`sever`发起
- 用于消息通知、直播间讨论区、聊天室、协同编辑

`WebSocket`连接过程：
1. 先发起一个`HTTP请求`
2. 成功之后在`升级`到`WebSocket`协议，再`通讯`

区别：

- `WebSocket`协议名是`ws://`，可双端发起请求（双端都可以`send`、`onmessage`）
- `WebSocket`没有`跨域`限制
- 通过`send`和`onmessage`通讯（`HTTP`通过`req`、`res`）

`ws`可升级为`wss`（像`https`）

## HTTP长轮询和WebSocket的区别

> 长轮询：一般是由客户端向服务端发出一个设置较长网络超时时间的 HTTP 请求，并在Http连接超时前，不主动断开连接；待客户端超时或有数据返回后，再次建立一个同样的HTTP请求，重复以上过程

- `HTTP长轮询`：客户端发起请求，服务端阻塞，不会立即返回
  - `HTTP长轮询`需要处理timeout，即timeout之后重新发起请求
- `WebSocket`：客户端可发起请求，服务端也可发起请求

## TCP三次握手和四次挥手

### 建立TCP连接

- 先建立连接，确保双方都有收发消息的能力
- 再传输内容（如发送一个get请求）
- 网络连接是TCP协议，传输内容是HTTP协议

### 三次握手-建立连接

1. `Client`发包，`Server`接收。`Server`就知道有`Client`要找我了
2. `Server`发包，`Client`接收。`Client`就知道`Server`已经收到消息
3. `Client`发包，`Server`接收。`Server`就知道`Client`要准备发送了
4. 前两步确定双发都能收发消息，第三步确定双方都准备好了

### 四次挥手-关闭连接

1. `Client`发包，`Server`接收。`Server`就知道`Client`已请求结束
2. `Server`发包，`Client`接收。`Client`就知道`Server`已收到消息，我等待`server`传输完成了在关闭
3. `Server`发包，`Client`接收。`Client`就知道`Server`已经传输完成了，可以关闭连接了
4. `Client`发包，`Server`接收。`Server`就知道`Client`已经关闭了，`Server`可以关闭连接了

## HTTP请求中token、cookie、session有什么区别

## cookie和session

- `cookie`用于登录验证，HTTP无状态的，每次请求都要携带cookie,以帮助识别身份
- `session`在服务端，存储用户详细信息，和`cookie`信息一一对应
- `cookie`+`session`是常见的登录验证解决方案

![](https://chao31.github.io/pics/img/202303111640853.png)

## cookie和token

- `cookie`是`HTTP规范`（每次请求都会携带），而`token`是自定义传递
- `cookie`会默认被浏览器存储，而`token`需自己存储
- `token`默认没有跨域限制

## JWT(json web token)

1. 前端发起登录，后端验证成功后，返回一个加密的`token`
2. 前端自行存储这个`token`（其他包含了用户信息，加密的）
3. 以后访问服务端接口，都携带着这个`token`，作为用户信息