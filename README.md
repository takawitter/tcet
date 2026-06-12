English [日本語](README.ja.md)

# TypedCustomEventTarget(tcet).

A strictly typed [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) and related definitions.
`type`, `currentTarget` and `detail` fields of event,
and `addEventListener`, `removeEventListener` and `dispatcheCustomEvent` are typed as event definitions.

[![Current Release](https://img.shields.io/npm/v/tcet.svg)](https://www.npmjs.com/package/tcet)
[![Licence](https://img.shields.io/github/license/takawitter/tcet)](https://github.com/takawitter/tcet/blob/master/LICENSE)

## Quick start

Define event target class that extends `TypedCustomEventTarget` and give self type and events definition as the value of type parameter.
Then, strongly typed definitions including `addEventListener` or other methods will be defined automatically.

```ts
class MyClass extends TypedCustomEventTarget<MyClass, {greeting: string}>{
  fire(){
    // dispatchCustomEvent accepts event type and detail value those defined as the second parameter of TypedCustomEventTarget.
    this.dispatchCustomEvent('greeting', 'hello');
  }
}

const mc = new MyClass();
mc.addEventListener('greeting', ({type, currentTarget, detail})=>{
  // type is 'greeting' type. currentTarget is `MyClass` type. detail is `string` type.
  console.log(`${detail}`);
});
mc.func(); // outputs 'hello'

// `ListenerFor` creates the type of event listener for specific event.
const listener: ListenerFor<MyClass, 'greeting'> = ({detail})=>{
  console.log(`${detail}`);
};
mc.addEventListener('hello', listener);
mc.removeEventListener('hello', listener);
```

## Code completion and hinting examples

### dispatchCustomEvent

![dispatchCustomEvent](./images/completion_dispatchCustomEvent.png)

### addEventListener

![addEventListener](./images/completion_addEventListener.png)

### ListenerFor

![ListenerFor](./images/completion_ListenerFor.png)

### detail field of event

![detailOfEvent](./images/hint_detail.png)

### currentTarget field of event

![currentTargetOfEvent](./images/hint_currentTarget.png)

### type field of event

![typeOfEvent](./images/hint_type.png)

## Features

In addition to standard `EventTarget` or related libraries, tcet has following definitions.

* An base class of event target class `TypedCustomEventTarget<T, Events>`. This class extends [EventTarget](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L11854). `T` is the event target class and `Events` is the definition of events that consists of pairs of event name and detail class. This class has following methods.
  * `addEventListener` and `removeEventListener`. These methods add or remove the event listener for specific events. These methods is defined as overload method for each event definition. (This technic is already used in other library [typescript-event-target](https://www.npmjs.com/package/typescript-event-target))
  * `dispatchCustomEvent(type: K, detail: D)`. This method dispatches specific event. This method is also defined as overload method for each events. Events are defined in `Events` type as `K: D` style. `K` is the event name and `D` is the type that defines the detail information of event (see example section below for details).
* Typed event class `TypedCustomEvent<T, K>`. This class extends [CustomEvent&lt;D&gt;](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L8830). `T` is the event target class and `K` is the name of an event. This class has following fields.
  * `type`. The type is `K`.
  * `currentTarget`. The type is the event target class `T`.
  * `detail`. The type is the detail type of event `K`. This field is defined by the base class `CustomEvent<D>`. `TypedCustomEvent<T, K>` extract `D` from the definition of `T` and pass it to `D` of `CustomEvent<D>`.

The code added by tcet is only the implementation of `dispatchCustomEvent` method. Other codes are used for type cheking in compile time and have no effect to generated code by static build.

## Install

```bash
npm i tcet
```

## Example 1

### Event definition

```ts
interface MyClassEvents{
  notify1: string;
  notify2: number;
}
```

In this example, `notify1` and `notify2` are event types, and `string` and `number` are types of `detail` object corresponding to each event types.

### EventTarget definition
```ts
import { TypedCustomEventTarget } from "tcet";

class MyClass extends TypedCustomEventTarget<MyClass, MyClassEvents>{
  f1(){
    // You can fire event by calling dispatchCustomEvent.
    // This is effectively same as dispatchEvent(new CustomEvent("notify1", "hello")).
    // Code completion available from IDE(i.e. VSCode).
    this.dispatchCustomEvent("notify1", "hello");
  }
  f2(){
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

## Example 2

### EventTarget definition

```ts
import { type ListenerFor, TypedCustomEventTarget } from "tcet";

// You can give an event defition inline.
class MyClass extends TypedCustomEventTarget<MyClass, {
  hello: {
    message: string;
  }
}>{
  f1(){
    this.dispatchCustomEvent("hello", {message: "hello"});
  }
}
```

### Adding or removing event listener

```ts
// You can define event listener independently using ListenerFor type that extract listener type from EventTarget class and event name.
const listner: ListenerFor<MyClass, "hello"> = ({detail: {message}})=>{
  console.log(message);
};
const mc = new MyClass();
mc.addEventListener("hello", listener);
mc.f1();
mc.removeEventListener("hello", listener);
```

### (FYI) Getting type information

```ts
type EventsDefinitionOfMyClass = EventsOf<MyClass>; // -> {hello: {message: string}}
type DetailTypeOfHelloEvent = EventDetailOf<MyClass, "hello">; // -> {message: string}
```
