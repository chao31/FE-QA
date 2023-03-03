## 左边固定右边自适应

看看下面的常见布局，当右边div的width为auto时，右边div宽度已是自适应

```css
.div1{
    width: 200px;
    height: 200px;
    border: 1px solid black;
}
.div2{
    width: 50px;
    height: 50px;
    background: red;
}
.div3{
    margin-left: 50px;
    width:auto;
    height:30px;
    background: blue;
}
```
![](https://chao31.github.io/pics/img/202303021628178.png)

所以要做的是把右边的div移上去，两行变成一行，有如下两种方法：
1.左边div再加个float：left（如果右边div没有margin-left:50px，则会覆盖左边div）
2.父div加relative，左div加absolute（让左边脱离文档流）

![](https://chao31.github.io/pics/img/202303021628918.png)

## 两边固定，中间自适应

思路：利用 `float` + `BFC`

1. 第一个div设置左浮动，第二个设置右浮动，它们会出现在一行的两侧
2. 第3个div会忽略第1、2个div的空间，也出现在第一行，但会被前两个覆盖（float脱离了文档流）, 如下：
![](https://chao31.github.io/pics/img/202303021624290.png)
3. 触发第3个div的BFC，使其不跟前两个接触，宽就自动收缩了

代码：

```html
<body>
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="center">center</div>
</body>
```

```css
.left {
	width: 50px;
	height: 50px;
	background: yellow;
	float: left;
}
.right {
	width: 50px;
	height: 50px;
	background: red;
	float: right;
}
	
.center {
	width: auto;
	height: 150px;
	background: blue;
	overflow: hidden;
}
```
html：
![渲染](https://chao31.github.io/pics/img/202303021619126.png)


## 画一条 0.5px 的线

## 如何画一个三角形