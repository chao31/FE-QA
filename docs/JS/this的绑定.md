## call、apply和bind的区别

除了`箭头函数`可以改变this的指向，还有`call`、`apply`和`bind`。它们在功能上没有区别，主要区别是`传参`和`调用`。
1. 函数.call(对象,arg1,arg2....)
2. 函数.apply(对象，[arg1,arg2,...])
3. var ss = 函数.bind(对象,arg1,arg2,....)

```js
function show(sex){  
    console.log("普通函数"+sex);  
}  
var person={  
    name:"aa",  
    age:14  
};  
show.call(person,"男");  
show.apply(person,["女"]);  

//对于bind来说，用法更加的灵活  
var ss = show.bind(person,"不明");  
ss();  
```
通过代码，很明显的就可以得出它们三者的区别，仅仅是`参数`传递的不同以及`bind`方法可以更加的方便的`调用`

## 箭头函数

箭头函数使用需要注意的地方：`this`、`new`、`arguments`、`yield`。

1. `this`对象的指向是可变的，但在箭头函数中是固定的，指向定义时所在的对象，而非调用时所在的对象
2. 不可以做`构造函数`，也就是不能使用`new`，否则抛出一个错误
3. 不可以使用`arguments`，因为它在函数体内不存在，可以用`rest`代替
4. 不可以使用`yield`命令，因此箭头函数不能用作 `Generator` 函数

### 不适用箭头函数的场景

#### 1. 对象方法

```js
window.name = '我是window';
const obj = {
  name: 'poetry',
  getName2() {
    // 这里的this指向obj
    return () => {
      // 这里的this指向obj
      return this.name
    }
  },
  // 1、不适用箭头函数的场景1：对象方法
  getName: () => { 
    // 这里不能使用箭头函数，否则箭头函数指向window
    return this.name
  }
}
obj.getName(); // 我是window
obj.getName2()(); // poetry
```

#### 2. 对象原型

```js
// 2、不适用箭头函数的场景2：对象原型
obj.prototype.getName3 = () => { 
  // 这里不能使用箭头函数，否则this指向window
  return this.name
}
```

#### 3. 构造函数

```js
// 3、不适用箭头函数的场景3：构造函数
const Foo = (name) => { 
  this.name = name
}
const f = new Foo('poetry') // 箭头函数没有 prototype 属性，不能进行 new 实例化
```

#### 4. 动态上下文的回调函数

```js
const btn1 = document.getElementById('btn1');
// 4、不适用箭头函数的场景4：动态上下文的回调函数
btn1.addEventListener('click', () => { 
  // 这里不能使用箭头函数 this === window
  this.innerHTML = 'click'
})
```

#### 5. vue的生命周期和method

```js
// 5、不适用箭头函数的场景5：vue的生命周期和method
// Vue 组件本质上是一个 JS 对象，this需要指向组件实例
// vue的生命周期和method不能使用箭头函数
new Vue({
  data:{name:'poetry'},
  methods: { 
    getName: () => {
      // 这里不能使用箭头函数，否则this指向window
      return this.name
    }
  },
  mounted: () => {
    // 这里不能使用箭头函数，否则this指向window
    this.getName()
  }
})
// React 组件（非 Hooks）它本质上是一个 ES6 class
class Foo {
  constructor(name) {
    this.name = name
  }
  getName = () => { // 这里的箭头函数this指向实例本身没有问题的
    return this.name
  }
}
const f = new Foo('poetry') 
console.log(f.getName() )
```