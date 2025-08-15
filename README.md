# tcet

TypedCustomEventTarget(tcet). Strictly typed [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget), with typed `currentTarget` and `detail` fields, and typed `add/remove/dispatch` methods.

[![Current Release](https://img.shields.io/npm/v/tcet.svg)](https://www.npmjs.com/package/tcet)
[![Licence](https://img.shields.io/github/license/takawitter/tcet.svg)](https://github.com/takawitter/tcet/blob/master/LICENSE)


## Motivation

As I researched at Apr. 2025, EventTarget or related libraries had
 untyped entities such as `Event.currentTarget` or `EventTarget.dispatchEvent`.
This library provides more strictly typed entities with simplified interface
to use event mechanism.

## Features

In addition to standard `EventTarget` or related libraries, tcet has following features.

* `TypedCustomEvent<T, D>` extends [CustomEvent&lt;D&gt;](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L8830)
  * `currentTarget` field is typed as the event source class `T`.
  * `detail` field is also typed by `CustomEvent<D>`.
* `TypedCustomEventTarget<T, Events>` extends [EventTarget](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L11854)
  * Dispatch method `dispatchCustomEvent(type: K, detail: D)` is defined as an overload method for each event defined by `Events`. Parameters (event type and detail object) are restricted to one of `Events` defiintions. `K` is one of the key of `Events` and `D` is defined as `Events[K]` (see example section below for details).
  * `addEventListener` and `removeEventListener` are also defined as typed overload methods similar to [typescript-event-target](https://www.npmjs.com/package/typescript-event-target).

## Install

```bash
npm i tcet
```

## Simple example

### Defining events as interface

```ts
interface MyClassEvents{
  notify1: string;
  notify2: number;
}
```

In this example, `notify1` and `notify2` are event types, and `string` and `number` are types of `detail` object corresponding to each event types.


### Defining an EventTarget class using event definition above and dispatching events
```ts
import { TypedCustomEventTarget } from "tcet";

class MyClass extends TypedCustomEventTarget<MyClass, MyClassEvents>{
  function f1(){
    // You can fire event by calling dispatchCustomEvent. Though this is effectively same as dispatchEvent(new CustomEvent("notify1", "hello")), code completion available from IDE(i.e. VSCode).
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
// code completion available from IDE(i.e. VSCode)
mc.addEventListener("notify1", ({currentTarget, detail})=>{
  // The type of currentTarget is MyClass
  console.log(detail); // prints "hello"
});
mc.addEventListener("notify2", ({detail})=>{
  console.log(detail); // prints 100
});
```


## Advanced usecase

### Defining an event listener

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

// You can use an event listener definition to define an event listener variable so that you can remove it from event target.
const listner: HelloListener = ({detail: {message}})=>{
  console.log(message);
};
const mc = new MyClass();
mc.addEventListener("hello", listener);
mc.f1();
mc.removeEventListener("hello", listener);
```
