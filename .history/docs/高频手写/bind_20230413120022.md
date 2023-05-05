实现一个原生 `bind`

```js
Function.prototype.myBind = function(context, ...args) {
    const self = this;
    return function(...newArgs) {
        return self.apply(context, [...args, ...newArgs]);
    }
}
```