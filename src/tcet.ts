/**
 * The typed version of CustomEvent.
 * CustomEvent already provides a type for `detail` field.
 * This class add a type to `currentTarget` field.
 * 
 * @template T the class which dispatched this Event.
 * @template D the detail type of the Event.
 */
export interface TypedCustomEvent<T extends TypedCustomEventTarget<T, any>, D> extends CustomEvent<D>{
	readonly currentTarget: T;
}

/**
 * The typed version of EventListener.
 * 
 * @template T the class which dispatched this Event.
 * @template D the detail type of the Event.
 */
export interface TypedCustomEventListener<T extends TypedCustomEventTarget<T, any>, D>{
    (this: T, evt: TypedCustomEvent<T, D>): void | Promise<void>;
}

/**
 * The typed version of EventListenerObject.
 * 
 * @template T the class which dispatched this Event.
 * @template D the detail type of the Event.
 */
export interface TypedCustomEventListenerObject<T extends TypedCustomEventTarget<T, any>, D>{
    handleEvent(evt: TypedCustomEvent<T, D>): void | Promise<void>;
}

/**
 * A convenient definition for event listeners.
 * 
 * @template T the class which dispatched this Event.
 * @template D the detail type of the Event.
 */
export type TypedCustomEventListenerOrObject<T extends TypedCustomEventTarget<T, any>, D> =
	TypedCustomEventListener<T, D> | TypedCustomEventListenerObject<T, D>;

/**
 * Strictly typed version of EventTarget.
 * To use features of this class, create a class extending this class.
 * 
 * @template T the class which extends this class and throws custom events.
 * @template Events the class which defines event types and details.
 * @example
 * ```typescript
 * interface MyEvents {
 *     notify1: string;
 *     notify2: number;
 * }
 *
 * class MyClass extends TypedCustomEventTarget<MyClass, MyEvents>{
 *     function fire1(){
 *         // code completion available
 *         this.dispatchCustomEvent("notify1", "hello");
 *     }
 * }
 * 
 * const mc = new MyClass();
 * // code completion available
 * mc.addEventListener("notify1", ({currentTarget, detail})=>{
 *     // type of currentTarget is `MyClass`
 *     // type of detail is `string`
 *     console.log(detail);
 * })
 * ```
 */
export interface TypedCustomEventTarget<T extends TypedCustomEventTarget<T, Events>, Events extends Record<string, any>>
extends EventTarget {
    addEventListener<K extends keyof Events & string>(
        type: K, listener: TypedCustomEventListenerOrObject<T, Events[K]> | null,
        options?: AddEventListenerOptions | boolean): void;

	removeEventListener<K extends keyof Events & string>(
        type: K, listener: TypedCustomEventListenerOrObject<T, Events[K]> | null,
        options?: EventListenerOptions | boolean): void;

	dispatchCustomEvent<K extends keyof Events & string>(
        type: K, detail?: Events[K]): boolean;
}
export class TypedCustomEventTarget<T extends TypedCustomEventTarget<T, Events>, Events extends Record<string, any>>
extends EventTarget {
	dispatchCustomEvent(type: string, detail: any){
		return super.dispatchEvent(new CustomEvent(type, {detail}));
	}
}
