# tcet

TypedCustomEventTarget(tcet) - yet another typed event target with strictly typed classes and methods.

This is a Strictly typed version of EventTarget.

## Motivation

Some classes or types of existing EventTarget or related libraries have
untyped entities such as Event.currentTarget or EventTarget.dispatchEvent.
This library provides more strictly-typed entities and simplified interface
to use event mechanisms.

## Features

* typed currentTarget (TypedCustomEvent<T, D>.currentTarget)
  * currentTarget field is always typed as source class. 
* typed dispatchCustomEvent (TypedCustomEventTarget<T, Events>.dispatchEvent)
  * dispatchCustomEvent is defined as overrload method. parameters (event type and detail object) are restricted as one of Events defiintions.
* simplified parameters of dispatchCustomEvent(type: string, detail: D)
  * type must be one of the key string of Events and detail must be a value of key in Events which was passed to the type parameter T of TypedCustomEvent.

## Install

```bash
npm i tcet
```

## Simple example

### Defining events

```ts
interface MyClassEvents{
  notify1: string;
  notify2: number;
}
```

### Definint event target class using event definition above and dispatching them from event source class
```ts
import { TypedCustomEventTarget } from "tcet";

class MyClass extends TypedCustomEventTarget<MyClass, MyClassEvents>{
  function f1(){
    // same as this.dispatchEvent(new CustomEvent("notify1", "hello"))
    // code completion available for IDE(i.e. VSCode)
    this.dispatchCustomEvent("notify1", "hello");
  }
  function f2(){
    this.dispatchCustomEvent("notify2", 100);
  }
}
```

### Receiving events
```ts
const mc = new MyClass();
// code completion available for IDE(i.e. VSCode)
mc.addEventListener("notify1", ({currentTarget, detail})=>{
  // The type of currentTarget is MyClass
  console.log(detail); // prints "hello"
});
mc.addEventListener("notify2", ({detail})=>{
  console.log(detail); // prints 100
});
```


## Advanced usecase

### Defining event listener

```ts
import { TypedCustomEventListenerOrObject, TypedCustomEventTarget } from "tcet";

// Detail information definition
interface HelloDetail{
  message: string;
}

type HelloListener = TypedCustomEventListenerOrObject<MyClass, HelloDetail>;

class MyClass extends TypedCustomEventTarget<MyClass, {
  hello: HelloDetail
}>{
  function f1(){
    this.dispatchCustomEvent("hello", {message: "hello"});
  }
}

// You can use listener definition when you need it such as the case you need to remove listener later.
const listner: HelloListener = ({detail: {message}})=>{
  console.log(message);
};
const mc = new MyClass();
mc.addEventListener("hello", listener);
mc.f1();
mc.removeEventListener("hello", listener);
```
