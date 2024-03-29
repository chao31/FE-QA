通过本文你可以学到：

1. `vue2` 的 `diff` 算法过程：
- 只会进行`同层比较`，时间复杂度从`O(n^3) -> O(n)`
- 首先判断`新、旧节点`是否值得对比（根据 `key` 和 `tag` 标签名判断，是否是`同类节点`）
  - `不值得`对比：删除旧节点，插入新节点
  - `值得`对比：若是`文本节点`，则更新文本内容；若是`元素节点`，则更新元素属性；
- 再来看`新、旧节点`的`子节点`
  - 若旧节点`没有`子节点，而新节点`有`，则`新建`子节点并插入；
  - 若旧节点`有子节点`，而新节点`没有`，则`删除`全部`子节点`；
  - 若新、旧节点`都有`子节点，则调用 `updateChildren` 进行下一步的比较，这也是 `diff` 算法的精髓：用`4 个指针`分别指向新、旧节点的`头部`和`尾部`
    - 若旧头 === 新头，则指针后移
    - 若旧尾 === 新尾，则指针前移
    - 若旧头 === 新尾，则指针往中间靠
    - 若旧尾 === 新头，则指针往中间靠
    - 新头逐个去查找（若找到了，将该节点移动到已处理过的节点后；若没找到，新建节点并移动到已处理过的节点后）
2. `vue3`的 diff 算法优化：使用`最长递增子序列`可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作
   - 头和头比
   - 尾和尾比
   - 基于`最长递增子序列`进行`移动/添加/删除`
     - 找到新节点中`还未比较过`的节点 (新头和新尾指针中间的节点)
     - 找到它们对应的下标，如`[ 5, 2, 3, 4, -1 ]`，`-1` 是老数组里没有的即`新增`
     - 找到最长递增子序列`[ 2, 3, 4 ]`，剩余节点基于它`移动/新增/删除`


## 什么是 diff 算法
要知道渲染真实 `DOM` 的开销是很大的，比如有时候我们修改了某个数据，如果直接渲染到真实 `dom` 上会引起整个 `dom` 树的重绘和重排，有没有可能我们只更新我们修改的那一小块 `dom` 而不要更新整个 `dom` 呢？`diff` 算法能够帮助我们。

我们先根据真实 `DOM` 生成一颗 `virtual DOM`，当 `virtual DOM` 某个节点的数据改变后会生成一个新的 `Vnode`，然后 `Vnode` 和 `oldVnode` 作对比，发现有不一样的地方就直接修改在真实的 `DOM` 上，然后使 `oldVnode` 的值为 `Vnode`。

`diff` 的过程就是调用名为 `patch` 的函数，比较新旧节点，一边比较一边给真实的 `DOM` 打补丁。

## virtual DOM
虚拟 dom 的节点属性如下：
```js
{
  sel: 'div', // 选择器，是什么标签
  key: 'A', // key
  children: [], // 子元素
  text: '文本', // 文本节点
  elem: el // 关联真实 dom
}
```

## diff 的主要流程
![](https://chao31.github.io/pics/img/01.png)

## patch
来看看 `patch` 是怎么打补丁的（代码只保留核心部分）
```js
function patch (oldVnode, vnode) {
    if (sameVnode(oldVnode, vnode)) {
      // 相同节点（值得比较）
        patchVnode(oldVnode, vnode)
    } else {
      // 不同节点（暴力删除，替换新的，不复用）

        const oEl = oldVnode.el // 当前 oldVnode 对应的真实元素节点
        let parentEle = api.parentNode(oEl)  // 父元素
        createEle(vnode)  // 根据 Vnode 生成新元素
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
        }
    }
    // some code 
    return vnode
}
```
`patch` 函数接收两个参数 `oldVnode` 和 `Vnode` 分别代表新的节点和之前的旧节点

判断两节点是否值得比较，值得比较则执行 `patchVnode`

```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key 值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了 data，data 包含一些具体信息，例如 onclick , style
    isDef(a.data) === isDef(b.data) &&  
    sameInputType(a, b) // 当标签是<input>的时候，type 必须相同
  )
}
```

不值得比较则用 `Vnode` 替换 `oldVnode`
如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明 `Vnode` 完全被改变了，就可以直接替换 `oldVnode`。

虽然这两个节点不一样但是他们的子节点一样怎么办？别忘了，diff 可是逐层比较的，如果第一层不一样那么就不会继续深入比较第二层了。（我在想这算是一个缺点吗？相同子节点不能重复利用了...）

## patchVnode
当我们确定两个节点值得比较之后我们会对两个节点指定 `patchVnode` 方法。那么这个方法做了什么呢？
```js
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(vnode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}
```
这个函数做了以下事情：

* 找到对应的真实 `dom`，称为 `el`
* 判断 `Vnode` 和 `oldVnode` 是否指向同一个对象，如果是，那么直接 `return`
* 如果他们都有文本节点并且不相等，那么将 `el` 的文本节点设置为 `Vnode` 的文本节点。
* 如果 `oldVnode` 有子节点而 `Vnode` 没有，则删除 `el` 的子节点
* 如果 `oldVnode` 没有子节点而 `Vnode` 有，则将 `Vnode` 的子节点真实化之后添加到 `el`
* 如果两者都有子节点，则执行 `updateChildren` 函数比较子节点，这一步很重要
* 其他几个点都很好理解，我们详细来讲一下 `updateChildren`

## updateChildren
`updateChildren` 是 `diff` 算法的精髓
```js
updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {   // 对于vnode.key的比较，会把oldVnode = null
            oldStartVnode = oldCh[++oldStartIdx] 
        }else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
           // 使用key时的比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```
主要做了这 5 个事：
1. 旧头 == 新头

2. 旧尾 == 新尾

3. 旧头 == 新尾

4. 旧尾 == 新头

5. 新头去逐个查找

## 真实例子

举个例子来说明一下：

```js
真实：[A, B, C, D, E]
旧：  [A, B, C, D, E]
新：  [A, F, C, G, E]
```

下面用`下标1`，代表指针在的位置，如 `A1` 代表当前指针在 `A` 这个节点。

1.

```js
真实: [A, B, C, D, E]
旧：  [A1, B, C, D, E1]
新:   [A1, F, C, G, E1]
```

比较前 `4` 步，若`头部`指针匹配，则`头部`的指针`往后`移动；若`尾部`的指针匹配，则`往前`移动：

- `A1 == A1`，头指针往后移动，再开始新一轮的 `5` 步比较；
- `E1==E1`，尾指针往前移

2.

经上面移动后，状态如下：

```js
真实: [A, B, C, D, E]
旧：  [A, B1, C, D1, E]
新:   [A, F1, C, G1, E]
```

- `F1` 前 `4` 步都不匹配，就`逐个查找`，发现没有;
- 则新建 `F`，插入已处理的节点后，也就是 `A` 后，并标记 `F'`,这一步直接在 `dom` 上操作，如下 3：

3.
```js
真实: [A, F（新）, B, C, D, E]
旧：  [A, B1, C, D1, E]
新:   [A, F`, C1, G1, E]
```

新节点 `C` 的前 `4` 步都不匹配，则`逐个查找`，在旧节点找到了 `C`，则将 `C` 移动到已处理的节点后，即 `F(新)` 后

4.
```js
真实: [A, F（新）, C（移动）, B, C, D, E]
旧：  [A, B1, C, D1, E]
新:   [A, F`, C`, G11, E]
```

- `G` 匹配 `5` 步都没有，则新建


5. 
真实: [A, F（新）, C（移动）, G（新建）, B, C, D, E]
旧：  [A, B1, C, D1, E]
新:   [A, F`, C`, G1, E1]

`G` 操作后，再往后移，此时，前指针移动到了后指针之后了，匹配结束，`将旧节点两个之间的节点删除`

6.
```js
真实: [A, F（新）, C（移动）, G（新建）, B删, C`删，D 删，E]
旧：  [A, B1, C, D1, E]
新：  [A, F`, C`, G1, E1]

=》真实：[A, F, C, G, E]
```
## 同层比较

`diff` 的比较方式：
- 进行`同层比较`，不会进行`跨层比较`，如：给一个子节点加上一个父节点，会认为父节点和以前的子节点是同层但不同，不会利用之前的子节点，而是将其删除后再创建
- `vue` 的 `diff` 并不是“无微不至”，但上面的做法并不影响效率，因为实际代码很少有上面这种操作，很少会跨越层级地移动 Dom 元素，所以 `Virtual Dom` 只会对同一个层级的元素进行对比，并且将时间复杂度优化到了`O(n^3) -> O(n)`

## vue3 的 diff 算法

在 `Vue2` 里 `updateChildren` 会进行

- 头和头比
- 尾和尾比
- 头和尾比
- 尾和头比
- 都没有命中的对比

在 `Vue3` 里 `patchKeyedChildren` 为

- 头和头比
- 尾和尾比
- 基于`最长递增子序列`进行`移动/添加/删除`

看个例子，比如

```js
老的 children：[ a, b, c, d, e, f, g ]
新的 children：[ a, b, f, c, d, e, h, g ]
```

1. 先进行头和头比，发现不同就结束循环，得到 [ a, b ]
2. 再进行尾和尾比，发现不同就结束循环，得到 [ g ]
3. 再保存没有比较过的节点 `[ f, c, d, e, h ]`，并通过 `newIndexToOldIndexMap` 拿到在数组里对应的下标，生成数组 `[ 5, 2, 3, 4, -1 ]`，`-1` 是老数组里没有的就说明是新增
4. 然后再拿取出数组里的`最长递增子序列`，也就是 `[ 2, 3, 4 ]` 对应的节点 `[ c, d, e ]`
5. 然后只需要把其他剩余的节点，基于 `[ c, d, e ]` 的位置进行移动/新增/删除就可以了

使用`最长递增子序列`可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作，有兴趣的话去 leet-code 第 300 题 (最长递增子序列) 体验下


[参考](https://juejin.cn/post/7010594233253888013)

