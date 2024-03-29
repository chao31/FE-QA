# rebase 和 merge 的区别
假设有个开发过程如下：
```html
1. master 分支有两个 commit：C1 -> C2
2. 我基于 master 切一个 dev 分支进行开发
3. dev 分支在今天下午生成了 3 个 commit，分别在：C3(2 点)-> C4(3 点) -> C5(6 点)
4. 同样在今天下午，其它开发者先于我在 master 分支上合入了自己的分支，C6(4 点) -> C7(5 点)，所以远程的 master 就变成了 C1 -> C2 -> C6(4 点) -> C7(5 点)
```
如下图：
![](https://chao31.github.io/pics/img/202304061641976.jpg)
```
5. 在7点，我想把我的dev分支合进master，有两种选择：merge和rebase
```

### 使用 git merge
```
1. 在master上，执行`git merge dev`
2. git会找出master和dev的最近共同祖先commit点，即分叉点C2
3. 然后进行合并，将dev最后1次的commit（C5）和master最后一次commit（C7）合并后生成一个新的commit（C8），有冲突的话需要解决冲突
4. 再将C8和C2之间的所有commit，按提交时间顺序进行排序
5. 最后生成的master：C1 -> C2 ->C3(2点)-> C4(3点) -> C6(4点) -> C7(5点) -> C5(6点) -C8(7点)
```
![](https://chao31.github.io/pics/img/202304061642826.jpg)

### 使用 git rebase
```
1. 在dev分支上，执行`git rebase origin/master`，push到dev远程后，再去master分支，执行`git merge dev`
2. 执行rebase时，git会找出master和dev的最近共同祖先commit点，即分叉点C2
3. 然后将dev分支上，C2到最后一次commit(C5)之间的所有commit截取，移接到master的最后一次commit(C7)后面，但截取的这一段(C3~C5的commit的hash值会变成新的，也就是变成了C3'~C5')
4. dev rebase了 master后，就变成了C1 -> C2 -> C6 -> C7 -> C3' -> C4' -> C5'
```
![](https://chao31.github.io/pics/img/202304061642080.jpg)

### merge 和 rebase 的区别
![](https://chao31.github.io/pics/img/202304061642577.jpg)
* `git merge` 操作合并分支会让两个分支的每一次提交都按照提交时间（并不是 push 时间）排序，并且会将两个分支的最新一次 commit 点进行合并成一个新的 commit，最终的分支树呈现菱形

* `git rebase`操作实际上是将当前执行 rebase 分支的所有基于原分支提交点之后的 commit 打散成一个一个的 patch，并重新生成一个新的 commit hash 值，再次基于原分支目前最新的 commit 点上进行提交，并不根据两个分支上实际的每次提交的时间点排序，rebase 完成后，切到基分支进行合并另一个分支时也不会生成一个新的 commit 点，最终的分支树呈现线性


