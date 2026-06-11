/**
 * The typed version of CustomEvent.
 * CustomEvent already provides a type for `detail` field.
 * This class add a type to `currentTarget` field.
 * 
 * @template T the class that dispatched and the source of this Event.
 * @template K the event type of the Event.
 */
export interface TypedCustomEvent<T extends TypedCustomEventTarget<T, Record<string, any>>, K extends keyof EventsOf<T> & string>
extends CustomEvent<EventDetailOf<T, K>>{
    type: K;
    readonly currentTarget: T;
}

/**
 * The typed version of EventListener.
 * 
 * @template T the class that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export interface TypedCustomEventListener<T extends TypedCustomEventTarget<T, Record<string, any>>, K extends keyof EventsOf<T> & string>{
    (this: T, evt: TypedCustomEvent<T, K>): void | Promise<void>;
}

/**
 * The typed version of EventListenerObject.
 * 
 * @template T the class that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export interface TypedCustomEventListenerObject<T extends TypedCustomEventTarget<T, Record<string, any>>, K extends keyof EventsOf<T> & string>{
    handleEvent(evt: TypedCustomEvent<T, K>): void | Promise<void>;
}

/**
 * A convenient definition for event listeners.
 * 
 * @template T the class of instance that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export type TypedCustomEventListenerOrEventListenerObject<T extends TypedCustomEventTarget<T, Record<string, any>>, K extends keyof EventsOf<T> & string> =
    TypedCustomEventListener<T, K> | TypedCustomEventListenerObject<T, K>;

/**
 * Strictly typed version of EventTarget.
 * To use features of this class, create a class extending this class.
 * 
 * @template T the class that extends this class and throws custom events.
 * @template Events the class that defines event types and details.
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
export interface TypedCustomEventTarget<
    T extends TypedCustomEventTarget<T, Events>,
    Events extends Record<string, any>>
extends EventTarget {
    addEventListener<K extends keyof Events & string>(
        type: K, listener: TypedCustomEventListenerOrEventListenerObject<T, K> | null,
        options?: AddEventListenerOptions | boolean): void;
    removeEventListener<K extends keyof Events & string>(
        type: K, listener: TypedCustomEventListenerOrEventListenerObject<T, K> | null,
        options?: EventListenerOptions | boolean): void;
}
type EventArgs<T> = [T] extends [void] ? [] : [detail: T];
export class TypedCustomEventTarget<
    T extends TypedCustomEventTarget<T, Events>,
    Events extends Record<string, any>>
extends EventTarget {
    declare readonly __eventsType: Events;
    dispatchCustomEvent<K extends keyof Events & string>(
        type: K, ...args: EventArgs<Events[K]>): boolean{
        return super.dispatchEvent(new CustomEvent(type, ...args));
    }
}

/**
 * An utility type that extract events type from event source type.
 * 
 * @template T the event target class that extends TypedCustomEventTarget.
 * @example
 * ```typescript
 * interface MyEvents {
 *     notify1: string;
 *     notify2: number;
 * }
 *
 * class MyClass extends TypedCustomEventTarget<MyClass, MyEvents>{
 * }
 * 
 * type ExtractedMyEvents = EventsOf<MyClass>;
 * // ExtractedMyEvents has same structure to MyEvents even that defined as unnamed type such as
 * // class MyClass extends TypedCustomEventTarget<MyClass, {notify1: string}>.
 * ```
 */
export type EventsOf<T> =
    T extends TypedCustomEventTarget<any, infer Events extends Record<string, any>> ? Events : never;

/**
 * An utility type that extract event detail type from event source type and event name.
 * 
 * @template T the event target class that extends TypedCustomEventTarget.
 * @template K the name of event.
 * @example
 * ```typescript
 * interface MyEvents {
 *     notify1: string;
 *     notify2: number;
 * }
 *
 * class MyClass extends TypedCustomEventTarget<MyClass, MyEvents>{
 * }
 * 
 * type ExtractedDetailTypeOfNotify1Event = EventDetailOf<MyClass, "notify1">;
 * // ExtractedDetailTypeOfNotify1Event is string.
 * ```
 */
export type EventDetailOf<T, K extends keyof EventsOf<T> & string> =
    T extends TypedCustomEventTarget<any, infer Events extends Record<string, any>> ? Events[K] : never;

/**
 * A shorthand of TypedCustomEventListenerOrEventListenerObject.
 * This type defines the type of event listner for event for event source type and event name.
 * 
 * @template T the event target class that extends TypedCustomEventTarget.
 * @template K the name of event.
 * @example
 * ```typescript
 * interface MyEvents {
 *     notify1: string;
 *     notify2: number;
 * }
 *
 * class MyClass extends TypedCustomEventTarget<MyClass, MyEvents>{
 * }
 * 
 * type EventListenerForNotify1 = ListenerFor<MyClass, "notify1">;
 * // EventListenerForNotify1 has the structure suitable for EventListener function or EventListener object for notify1 event.
 * ```
 */
//export type ListenerFor<T, K extends keyof EventsOf<T> & string> =
//    T extends TypedCustomEventTarget<any, any> ? TypedCustomEventListenerOrObject<T, K> : never;
export type ListenerFor<T extends TypedCustomEventTarget<T, EventsOf<T>>, K extends keyof EventsOf<T> & string> =
    TypedCustomEventListenerOrEventListenerObject<T, K>;

// CustomEvent related type definitions
export interface CustomEventListener<D>{
    (evt: CustomEvent<D>): void;
}
export interface CustomEventListenerObject<D>{
    handleEvent(object: CustomEvent<D>): void;
}
export type CustomEventListenerOrEventListenerObject<D> =
    CustomEventListener<D> | CustomEventListenerObject<D>;
