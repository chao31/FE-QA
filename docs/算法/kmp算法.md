### 什么是 kmp 算法

快速的从一个`主串`中找到我们想要的的`子串`，也就是`indexOf`函数的功能例如：
![dsd](https://camo.githubusercontent.com/95ab6183358115b3b54972a1d85293497f8dc736310d69f63bae47371c194e86/68747470733a2f2f692e6779617a6f2e636f6d2f35666337343632326261623066623631333730356635326662613933393539332e676966)
```js
输入：main = "abadccbaaababcabaadd", sub = "ababcabaa"

// step1: 找出子串 sub 的每个子串的公共前后缀

a: 0
ab: 0
aba: 1, a --  b -- a
abab: 2, ab --  -- ab
ababc: 0
ababca: 1, a -- babc -- a
ababcab: 2, ab -- abc -- ab
ababcaba: 3, aba -- bc -- aba
ababcabaa: 1, a -- babcaba -- a

// step2: 把公共前后缀的个数保存在 next 数组
const next = [0, 0, 1, 2, 0, 1, 2, 3, 1]

// step3: 对比，发现 'c' 和 'a' 不同

abadc'c'baaababcabaadd
ababc'a'baa

// step4: 对比，发现 'c' 和 'a' 不同

abadc'c'baaababcabaadd
      ababc'a'baa

// step5: 对比，发现 'c' 和 'a' 不同

abadc'c'baaababcabaadd

ababab 
ababcabaa

abababcb 
  ababcabaa

```

### 暴力匹配实现

```js
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
-    let lenP = haystack.length;
-    let lenC = needle.length;
+    for(let i = 0; i <= lenP - lenC; i++) {
        
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

