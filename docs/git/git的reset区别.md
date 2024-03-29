# git reset、--soft、--hard 的区别
```js
git reset [--soft | --mixed | --hard] 
```
为了简单，不用`工作区`和`暂存区`描述，用`红色文件`和`绿色文件`描述

### git reset 
`git reset` 不加参数，默认是`--mixed`

git 会回到指定的 `commit`，并将两个 `commit` 之间的所有 `diff` 保留下来（`红色文件`）

利用这个特性，在合 `master` 前，`feature` 分支的 `commit` 太多，希望合成一个
```js
// 回到最初的 commit
git reset xxxxx
// 重新提一个 commit
git add -A
git commit -m '新功能 xxx'
```
> ☑️ Squash commits when merge request is accepted.
> 其实提 MR 时，勾选这个，就能合并所有的 commit

### git reset --hard
git 会回到指定的 `commit`，但两个 `commit` 之间的所有 `diff` 都被删除，干干净净的回到指定 `commit`（如果执行这个命令之前就有被修改的`红色文件`，执行之后也会`被删除`）

### git reset --soft
git 会回到指定的 `commit`，并将两个 `commit` 之间的所有 `diff` 保留下来，但不会变成`红色文件`，而是变成`绿色文件`（执行命令之前的`红色文件`修改，依然保留下来为`红色`）