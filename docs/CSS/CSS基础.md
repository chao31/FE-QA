## 盒模型

两种盒模型： `W3C标准盒模型`和`IE盒模型`

简单理解如下：
```js
W3C标准盒模型：width = content
IE盒模型：width = content + padding + border
```

可使用box-sizing切换两个模型
```css
box-sizing: border-box; /* 触发IE盒模型*/
box-sizing: content-box; /* 触发标准盒模型*/
```

![](https://chao31.github.io/pics/img/202303021357878.png)

![](https://chao31.github.io/pics/img/202303021359705.png)

## BFC

BFC全称”Block Formatting Context”, 中文为`块级格式化上下文`。

Formatting Context：指页面中的一个渲染区域，并且拥有一套渲染规则，他决定了其子元素如何定位，以及与其他元素的相互关系和作用。


### BFC的触发（满足以下条件之一）：

- 根元素
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、flex、 inline-flex、table-cell、table-caption
- position的值为absolute或fixed

### BFC的约束规则

* 生成BFC元素的子元素会一个接一个的放置。垂直方向上他们的起点是一个包含块的顶部，两个相邻子元素之间的垂直距离取决于元素的margin特性。在BFC中相邻的块级元素外边距会折叠。
* 生成BFC元素的子元素中，每一个子元素做外边距与包含块的左边界相接触，（对于从右到左的格式化，右外边距接触右边界），即使浮动元素也是如此（尽管子元素的内容区域会由于浮动而压缩），除非这个子元素也创建了一个新的BFC（如它自身也是一个浮动元素）。

### 通俗的解释

- 内部的Box会在垂直方向上一个接一个的放置
- 垂直方向上的距离由margin决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生重叠，与方向无关。）
- 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然

看到以上的几条约束，让我想起学习css时的几条规则

- Block元素会扩展到与父元素同宽，所以block元素会垂直排列
- 垂直方向上的两个相邻DIV的margin会重叠，而水平方向不会(此规则并不完全正确)
- 浮动元素会尽量接近往左上方（或右上方）
- 为父元素设置overflow：hidden或浮动父元素，则会包含浮动元素

## margin重叠

![](https://chao31.github.io/pics/img/202303021731744.png)

margin重叠计算方法：

- 全部都为正值，取最大者(1, 2 , 3 中 取 3)
- 不全是正值，则取绝对值，然后 最大的正边界 减去 绝对值最大的负边界 ([1, 2, 6] 和 [ -1, -3, -9] 中 取 6 - |-9| 的值）；
- 没有正值，则都取绝对值，然后用0减去最大值。(-1, -2 , -3 中 取 -3)

注意：

- 水平边距永远不会重合
- BFC后，消除了margin重叠

防止外边距重叠解决方案：

- 外层元素padding代替
- 内层元素透明边框 border:1px solid transparent;
- 内层元素绝对定位 postion:absolute:
- 外层元素 overflow:hidden;
- 内层元素 加float:left;或display:inline-block;
- 内层元素padding:1px;

## CSS选择器

```css
权重计算方式： !important > 行内样式 > id > class > tag
```

不常见的几个：

```
1. 相邻选择器（h1 + p）
2. 子选择器（ul > li）
3. E[foo~="bar"] : foo属性值是一个以空格符分隔的列表，其中一个列表的值为“bar”
4. a[src*="abc"] : 选择其 src 属性中包含 "abc" 子串的每个 <a> 元素。
5. E[foo^="bar"] 、E[foo$="bar"]，以^开头，以$结尾。
6. nth-child(3n+1) 隔两个选一个
```
很有意思的子类选择器：
```css
:nth-child(n) ：
官方解释：选择器匹配属于其父元素的第 N 个子元素，不论元素的类型。
但其实是如，p:nth-child(n) 匹配p的父元素的第 N 个子元素，且子元素为p
```
[第几个p标签背景是红色](https://www.runoob.com/try/try.php?filename=trycss3_nth-child)

## 脱离文档流的几种方法

* 完全脱离文档流：`float` 、 `absolute` 、 `fixed`
* 半脱离文档流：`relative`

总结：
1. 某元素的`position`设置了这几种定位后，该元素依然在以前的位置，除非再给它设置`top`、`left`等才会偏移，这时区别就出来了，`absolute`是相对非static的第一个父元素定位，`fixed`是相对于html定位，而`relative`是相对于它原来位置。
2. 而使用float脱离文档流时，其他盒子会无视这个元素，但其他盒子内的文本依然会为这个元素让出位置，环绕在该元素的周围。

参考：[HTML脱离文档流的三种方法](https://blog.csdn.net/thelostlamb/article/details/79581984)

## 清除浮动

float特点：

1. 元素的水平方向浮动，意味着元素只能`左右`移动而不能`上下`移动。
2. 一个浮动元素会尽量向左或向右移动，直到它的外边缘碰到`包含框`或另一个`浮动框`的边框为止。
3. 文本元素将围绕它。
4. clear 属性指定元素两侧不能出现浮动元素。

### 1.浮动造成换行问题
描述：例子如：两个div设置了左浮动，想第三个div换行
（如果第三个也是左浮动，则宽度小于父元素剩余宽度的话，就不会换行；如果第三不是浮动等特殊情况，会覆盖第一个div位置，但文字不会覆盖而是环绕）
![](https://chao31.github.io/pics/img/202303021707995.png)

解决：给第三div设置style="clear:both"

![](https://chao31.github.io/pics/img/202303021707847.png)

### 2.浮动会造成 父元素塌陷 问题。

如果一个父元素的所有子元素都是浮动的，子元素的浮动确定了自身位置，尽管子元素有高度，但是不会影响到父元素的高度，那么这个父元素高度就是0（若没有指的宽度，就是父元素宽度）。如果想要父元素内的浮动元素占有父元素的高度，就需要清除浮动。

![](https://chao31.github.io/pics/img/202303021703792.png)

解决方法：

```css
.parent:after {  
    content: " ";    
    display: block;   
    clear: both;     
} 
```
![](https://chao31.github.io/pics/img/202303021703143.png)

还有两种不推荐的解决方法：

1. 触发父元素的BFC，在具有浮动元素的父容器中置“overflow”的属性值为“hidden”，或者position：absolute
2. 在容器的结束标签前添加一个空的div，在空div上直接设置样式“clear:both”

## 垂直居中的方案

1. 利用 relative + absulute + transform
```js
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
 
```

如果知道子元素的宽和高，可以用`margin-left` 和 `margin-top`去替代`translate(-50%, -50%)`，另外水平居中也可以用`margin: 0 , auto`

2. 利用 flex ，最经典最方便的一种了，不用解释，定不定宽高无所谓

```js
.father {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    background: skyblue;
}
.son {
    width: 100px;
    height: 100px;
    background: red;
}
```

3. 行内元素水平居中可设置：`text-align: center`

## CSS动画和过渡

css实现动画的方式，有如下几种：

- `transform`： 转变动画
- `transition`： 实现渐变动画
- `animation`： 实现自定义动画

### transform

平移： `translate(x, y)`、translateX(x)、translateY(y)、translateZ(z)
缩放： `scale(x[,y])`、scaleX()、scaleY(y)、scaleZ(z)
旋转： `rotate(angle)`、rotateX(angle)、rotateY(angle)、rotateZ(angle)
倾斜： `skew(x-angle,y-angle)`、skewX(angle)、skewY(angle)

### transition

```css
transition: property duration timing-function delay;
/* 
transition: 属性 动画持续时长 出入动画速率 延迟几秒执行；
timing-function: ease ease-in ease-out linear 
*/
```

如：

```css
div {
    width:100px;
    transition: width 2s linear 2s;
}
div:hover {width:300px;}
```
### animation

```css
animation: name duration timing-function delay 动画的播放次数 是否反向播放动画 等;
```
例如：

```css
div {
	animation:mymove 5s infinite;
}

@keyframes mymove
{
	from {left:0px;}
	to {left:200px;}
}
```

### 应用：实现一个图片旋转

```css
#loader {
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0%   {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## em/px/rem/vh/vw的区别

### 什么是像素

`像素`就是最小的一个单位。在图片上，是一个不可再分割的点；而在手机屏幕上，就是屏幕上的一个光点。所以：

- 图片像素：最小的一个点。
- 设备像素: 我们常说的`分辨率`就是长和宽上像素点的`个数`，比如 IPhone 14的分辨率是 1125×2436，代表屏幕横向和纵向分别有 1125 和 2436 个像素点。

### 1px ≠ 1像素

简单理解：
```js
// 比如在iPhone上，1个css像素对应 3 * 3 的 9个设备像素点 
1 css px = 3 * 3 device px
```

设备像素比可以通过js获取
```js
window.devicePixelRatio
```

### em

EM 相对于元素自身的 font-size，

```css
p {
  font-size: 16px;
  padding: 1em; /* 1em = 16px */
}
```

如果元素没有显式地设置 font-size，那么 1em 等于多少呢？

这个问题其实跟咱说的 em 没啥关系，这里跟 font-size 的计算规则相关，回顾一下。如果元素没有设置 font-size，会继承父元素的 font-size，如果父元素也没有，会沿着 DOM 树一直向上查找，直到根元素 html，根元素的默认字体大小为 16px。

理解了 EM，REM 就很简单了。

### rem

REM 是相对于根元素的 EM。所以它的计算规则比较简单，

1 rem 就等于根元素 html 的字体大小

```css
html {
  font-size: 14px;
}

p {
  font-size: 1rem; /* 1rem = 14px */
}
```

实际开发中，设计图的单位是 CSS 像素，我们可以借助一些工具将 px 自动转换为 rem，

下面是一个用 PostCSS 插件在基于 Webpack 构建的项目中自动转换的例子，

```js
var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [px2rem({remUnit: 75})];
  }
}
```

### vw，vh，百分比

响应式设计里，vw 和 vh 常被用于布局，因为它们是相对于视口的，

- vw，viewport width，视口宽度，所以 1vw = 1% 视口宽度
- vh，viewport height，视口高度，所以 1vh = 1% 视口高度

浏览器对于 `vw` 和 `vh` 的支持相对较晚，在 Android 4.4 以下的浏览器中可能没办法使用

以 IPhone X 为例，vw 和 CSS 像素的换算如下，

```html
<!-- 假设我们设置视口为完美视口，这时视口宽度就等于设备宽度，CSS 像素为 375px -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
  p {
    width: 10vw; /* 10vw = 1% * 10 * 375px = 37.5px */
  }
</style>
```

## flex布局

`flex: 1` 是什么意思？

- `flex-grow`: 1 ：默认为 `0` ，如果存在剩余空间，元素也不放大。设置为 1  代表会放大。
- `flex-shrink`: 1 ：默认为 `1` ，如果空间不足，元素缩小。
- `flex-basis`: 0% ：该属性定义在分配多余空间之前，元素占据的主轴空间。浏览器就是根据这个属性来计算是否有多余空间的。默认值为 auto ，即项目本身大小。设置为 0%  之后，因为有 `flex-grow`  和 `flex-shrink` 的设置会自动放大或缩小。

## 如果要做优化，CSS提高性能的方法有哪些？
