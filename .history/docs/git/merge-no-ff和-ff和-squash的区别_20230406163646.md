### 一张图来告诉你--no-ff 和--ff
![](https://chao31.github.io/pics/img/b6.png)

### git merge
> 我们平常什么都不加的时候，则使用默认的 --ff，即 fast-forward 方式

> fast-forward 方式就是当条件允许的时候，git 直接把 HEAD 指针指向合并分支的头，完成合并。属于“快进方式”，不过这种情况如果删除分支，则会丢失分支信息。因为在这个过程中没有创建 commit

### git merge --no-ff
```
指的是强行关闭fast-forward方式,保留分支的commit历史
```

### git merge --squash

> 是用来把一些不必要 commit 进行压缩，比如说，你的 feature 在开发的时候写的 commit 很乱，那么我们合并的时候不希望把这些历史 commit 带过来，于是使用


### 动图来告诉几种合并的区别
![](https://chao31.github.io/pics/img/b1.gif)
![](https://chao31.github.io/pics/img/b2.gif)
![](https://chao31.github.io/pics/img/b3.gif)
![](https://chao31.github.io/pics/img/b4.gif)
![](https://chao31.github.io/pics/img/b5.png)

### 举个例子
![](https://chao31.github.io/pics/img/a1.png)
> 在 master 分支上，执行`git merge hotfix`
> 然后看到了 Fast-forward 的字样，hotfix 通过--ff 的方式合进了 master，如下：
![](https://chao31.github.io/pics/img/a2.png)
> 仅仅是 master 指针指向了这个提交 C4。这样是一种比较快的合并方式，轻量级，简单。
> 这个时候，我们往往会删掉 hotfix 分支，因为它的历史作用已经结束，这个时候，我们的 iss53 这个功能又向前开发，进行了一次提交，到了 C5，那么变成了这样：
![](https://chao31.github.io/pics/img/a3.png)
> 然后，我们要把 iss53 这个分支合并回 master，因为有分叉，两个版本的内容要进行合并，是不能用 Fast-forward（只有在没有需要合并内容的时候，会有这个 fast-forward 方式的提交） ，这时用的就是--no-ff 的效果，并生成了一个新的 commit 号
![](https://chao31.github.io/pics/img/a4.png)
> 如果我们对第一次合并，使用了--no-ff 参数，那么也会产生这样的结果，生成一个新的提交，实际上等于是对 C4 进行一次复制，创建一个新的 commit，这就是--no-ff 的作用。

参考：
1. [“git merge”和”git merge–no ff”有什么区别？](https://www.codenong.com/9069061/)
2. [Git：git-merge 的--ff 和--no-ff](https://blog.csdn.net/chaiyu2002/article/details/81020370)

