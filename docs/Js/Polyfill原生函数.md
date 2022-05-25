### Object.create 实现原理

[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

#### 语法

```js
Object.create(proto，[propertiesObject])
```

| 参数 | 说明 |
| -----| ---- |
| `proto` | 新创建对象的`原型对象`。 |
| `propertiesObject` | 可选，为新创建的`对象`添加指定的`属性`值。 |

#### 实现

```js
  Object.create = function (proto, propertiesObject) {
      if (typeof proto !== 'object' && typeof proto !== 'function') {
          throw new TypeError('proto 需要是个 Object 类型 ' + proto);
      } else if (proto === null) {
          throw new Error('proto 不能是个 null');
      }

      function F() {}
      F.prototype = proto;

      return new F();
  };
```
