const get = (from, ...selectors) =>
  [...selectors].map(s =>
    s
      // 标准答案里的正则匹配应该这样，/\[([^\[\]]*)\]/g ，下面是简化版
      .replace(/\[(.)\]/g, '.$1.')
      .split('.')
      .filter(t => t !== '')
      .reduce((prev, cur) => prev && prev[cur], from)
  );

// Examples
const obj = {
  selector: { to: { val: 'val to select' } },
  target: [1, 2, { a: 'test' }],
};
const aa = get(obj, 'selector.to.val', 'target[0]', 'target[2].a'); // ['val to select', 1, 'test']
console.log(111, aa);