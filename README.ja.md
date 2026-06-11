[English](README.md) 日本語

# TypedCustomEventTarget(tcet).

強く型付けされた [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)です。
`currentTarget` と `detail` フィールド、`add/remove/dispatch` メソッドにイベントに応じた型が追加されます。

[![Current Release](https://img.shields.io/npm/v/tcet.svg)](https://www.npmjs.com/package/tcet)
[![Licence](https://img.shields.io/github/license/takawitter/tcet)](https://github.com/takawitter/tcet/blob/master/LICENSE)


## 作った動機

2025年4月頃、`EventTarget`を使おうとして、TypeScriptのライブラリでは型がしっかり付いていないことに気づきました。
他のライブラリも探してみましたが、`EventTarget.addEventListner` には型がついていても、`Event.currentTarget` や
`EventTarget.dispatchEvent` にはないものしかなかったので、自作することにしました。

## 簡単な使い方

イベントを発生させるクラスで `TypedCustomEventTarget` を継承し、型引数に自身の型とイベント名と詳細情報を定義した型を渡してください。
すると、`addEventListener` などのメソッドが、それに渡すリスナーにまで型情報が付与された状態で定義されます。

```ts
class MyClass extends TypedCustomEventTarget<MyClass, {hello: string}>{
  func(){
    this.dispatchCustomEvent('hello', 'world');
  }
}

const mc = new MyClass();
mc.addEventListener('hello', ({type, currentTarget, detail})=>{
  // typeは'hello'型, currentTargetは `MyClass`型, detailは `string`型
  console.log(`hello ${detail}`);
});
mc.func(); // 'hello world' が出力される。

// リスナーを独立して定義するときは、`ListenerFor` を使うと便利です。
const helloListener: ListenerFor<MyClass, 'hello'> = ({detail})=>{
  // detailは `string`型
  console.log(`hello ${detail}`);
};
mc.addEventListener('hello', helloListener);
mc.removeEventListener('hello', helloListener);
```

## コード補完とタイプヒントの例

### dispatchCustomEvent

![dispatchCustomEvent](./images/completion_dispatchCustomEvent.png)

### addEventListener

![addEventListener](./images/completion_addEventListener.png)

### detail field of event

![detailOfEvent](./images/hint_detail.png)

### currentTarget field of event

![currentTargetOfEvent](./images/hint_currentTarget.png)

### type field of event

![typeOfEvent](./images/hint_type.png)

## 特徴

TypeScriptの `EventTarget` をベースに、以下の拡張を行っています。

* イベントターゲットのベースクラス `TypedCustomEventTarget<T, Events>` が追加されています。これは [EventTarget](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L11854) を継承したクラスで、`T` はイベントターゲットのクラス、`Events` はイベント名とイベント発生時の詳細情報を定義したクラスです。以下のメソッドを持ちます。
  * `addEventListener` と `removeEventListener`。特定のイベントを受け取るリスナを追加または削除します。`TypedCustomEventTarget`に渡された `Events` 内の定義毎にオーバーロードが定義されます。(種類毎のオーバーロード定義は、既存のライブラリ [typescript-event-target](https://www.npmjs.com/package/typescript-event-target) でも使われている手法です)
  * `dispatchCustomEvent(type: K, detail: D)`。イベントのディスパッチを行うメソッドです。`TypedCustomEventTarget` に渡された `Events` 内の定義毎にオーバーロードが定義されます。イベントは `Events` 内で `K: D` の形式で定義でき、`K` がイベント名、`D` がイベントの詳細情報を格納する型です。(利用例を参照してください)
* イベント `TypedCustomEvent<T, K>` は [CustomEvent&lt;D&gt;](https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/main/baselines/dom.generated.d.ts#L8830)を継承したクラスで、`T` はイベントターゲットのクラス、`K` はイベント名を表します。以下のフィールドを持ちます。
  * `type`。型は `K` になります。
  * `currentTarget`。型はイベントターゲットのクラスである `T` です。
  * `detail`。型はイベントの詳細情報を定義するクラス `D` です。これはベースクラスの `CustomEvent<D>` による型付けです。`T` の定義から `K` に対応したイベントの詳細の型を取り出し、`CustomEvent<D>` のパラメータ `D` に与えています。 

tcetの導入により追加されるコードは、`dispatchCustomEvent`メソッドの実装のみです。他はコンパイル時の型チェックに使われる定義のみで、静的ビルド時に生成されるコードのサイズには影響しません。

## Install

```bash
npm i tcet
```

## Example 1

### イベントの定義

```ts
interface MyClassEvents{
  notify1: string;
  notify2: number;
}
```

`notify1` と `notify2` がイベント名で、それぞれの詳細情報の型は `string` と `number` です。

### イベントターゲットの定義
```ts
import { TypedCustomEventTarget } from "tcet";

class MyClass extends TypedCustomEventTarget<MyClass, MyClassEvents>{
  function f1(){
    // `dispatchCustomEvent` を呼ぶと、イベントを発生させられます。
    // これは `dispatchEvent(new CustomEvent("notify1", "hello"))` を実行するのと同じです。
    // tcetによる型付けにより、IDE(VSCode等)でコード補完が効きます。
    this.dispatchCustomEvent("notify1", "hello");
  }
  function f2(){
    this.dispatchCustomEvent("notify2", 100);
  }
}
```

### イベントの受け取り
```ts
const mc = new MyClass();
// `addEventListener` ではコード補完が効きます。
mc.addEventListener("notify1", ({currentTarget, detail})=>{
  // `currentTarget`の型は `MyClass` です。`detail`の型は`string`です。
  console.log(detail); // "hello" と出力されます。
});
mc.addEventListener("notify2", ({detail})=>{
  console.log(detail); // 100 と出力されます。
});
```

## Example 2

### イベントターゲットの定義

```ts
import { type ListenerFor, TypedCustomEventTarget } from "tcet";

// イベント定義をインラインで与えることもできます。
class MyClass extends TypedCustomEventTarget<MyClass, {
  hello: {
    message: string;
  }
}>{
  function f1(){
    this.dispatchCustomEvent("hello", {message: "hello"});
  }
}
```

### イベントリスナの追加と削除

```ts
// イベントリスナを独立して定義する場合には、`ListenerFor`を使用してリスナの型を取り出すと便利です。
// その際、型パラメータに、イベントターゲットの型とイベント名を与える必要があります。
const listner: ListenerFor<MyClass, "hello"> = ({detail: {message}})=>{
  console.log(message);
};
const mc = new MyClass();
mc.addEventListener("hello", listener);
mc.f1();
mc.removeEventListener("hello", listener);
```

### (FYI)追加の情報取得

```ts
type EventsDefinitionOfMyClass = EventsOf<MyClass>; // -> {hello: {message: string}}
type DetailTypeOfHelloEvent = EventDetailOf<MyClass, "hello">; // -> {message: string}
```

`EventsOf<T>`で `T` で定義されたイベントの型の取得、`EventDetailOf<T, K>` で `T` で定義されたイベント `K` の詳細情報の型が取得できます。

