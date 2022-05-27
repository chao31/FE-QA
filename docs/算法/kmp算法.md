### 题目

实现 `indexOf()` 方法：返回调用它的 String 对象中第一次出现的指定值的`索引`

[题目来源](https://leetcode.cn/problems/implement-strstr)

#### 示例

```js
// 示例 1
输入：haystack = "hello", needle = "ll"
输出：2

// 示例 2
输入：haystack = "aaaaa", needle = "bba"
输出：-1
```

### 暴力匹配实现

```js
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    let lenP = haystack.length;
    let lenC = needle.length;
    for(let i = 0; i <= lenP - lenC; i++) {
        
        let j = 0;
        let ii = i;
        while(j < lenC && haystack[ii] === needle[j]) {
            ii++;
            j++;
        }

        if(j === lenC) return i;
    }

    return -1;
};
```
| 执行用时 | 内存消耗 |
| -----| ---- |
| 48ms |41 MB|
| 提交中击败了 99.12% | 提交中击败了 77.35%|