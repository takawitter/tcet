/**
 * The typed version of CustomEvent.
 * CustomEvent already provides a type for `detail` field.
 * This class add a type to `currentTarget` field.
 *
 * @template T the class that dispatched and the source of this Event.
 * @template K the event type of the Event.
 */
export interface TypedCustomEvent<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> extends CustomEvent<EventDetailOf<T, K>> {
    readonly type: K;
    readonly currentTarget: T;
}
/**
 * To eliminate extra code generation, reuse the constructor of CustomEvent as the one of TypedCustomEvent.
 */
export interface TypedCustomEventInit<D> extends CustomEventInit<D> {
    detail: D;
}
type EventInitDictArg<D> = D extends void ? [
    eventInitDict?: EventInit
] : [
    eventInitDict: TypedCustomEventInit<D>
];
interface TypedCustomEventConstructor {
    new <T extends TypedCustomEventTarget<T, EventsOf<T>>, K extends KeyOf<EventsOf<T>>>(type: K, ...eventInitDict: EventInitDictArg<EventDetailOf<T, K>>): TypedCustomEvent<T, K>;
}
export declare const TypedCustomEvent: TypedCustomEventConstructor;
/**
 * The typed version of EventListener.
 *
 * @template T the class that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export interface TypedCustomEventListener<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> {
    (this: T, evt: TypedCustomEvent<T, K>): void;
}
/**
 * The typed version of EventListenerObject.
 *
 * @template T the class that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export interface TypedCustomEventListenerObject<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> {
    handleEvent(evt: TypedCustomEvent<T, K>): void;
}
/**
 * A convenient definition for event listeners.
 *
 * @template T the class of instance that dispatched and the source of this Event.
 * @template K the detail type of the Event.
 */
export type TypedCustomEventListenerOrEventListenerObject<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> = TypedCustomEventListener<T, K> | TypedCustomEventListenerObject<T, K>;
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
 *         this.dispatchEvent("notify1", {detail: "hello"});
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
export interface TypedCustomEventTarget<T extends TypedCustomEventTarget<T, Events>, Events extends Record<string, any>> extends EventTarget {
    addEventListener<K extends KeyOf<Events>>(type: K, listener: ListenerFor<T, K> | null, options?: AddEventListenerOptions | boolean): void;
    removeEventListener<K extends KeyOf<Events>>(type: K, listener: ListenerFor<T, K> | null, options?: EventListenerOptions | boolean): void;
}
export declare class TypedCustomEventTarget<T extends TypedCustomEventTarget<T, Events>, Events extends Record<string, any>> extends EventTarget {
    readonly __eventsType: Events;
    dispatchEvent<K extends KeyOf<Events>>(event: TypedCustomEvent<T, K>): boolean;
    dispatchEvent<K extends KeyOf<Events>>(type: K, ...eventInitDict: EventInitDictArg<Events[K]>): boolean;
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
export type EventsOf<T extends TypedCustomEventTarget<any, any>> = T extends TypedCustomEventTarget<any, infer Events> ? Events : never;
/**
 * An utility type that extract the union of event key from event definition.
 *
 * @template Events the event definition
 * @example
 * ```typescript
 * interface MyEvents {
 *     notify1: string;
 *     notify2: number;
 * }
 * type ExtractedKeyOfMyEvents = KeyOf<MyEvents>;
 * // ExtractedKeyOfMyEvents is "notify1" | "notify2"
 * ```
 */
export type KeyOf<Events extends Record<string, any>> = keyof Events & string;
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
export type EventDetailOf<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> = EventsOf<T>[K];
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
export type ListenerFor<T extends TypedCustomEventTarget<any, any>, K extends KeyOf<EventsOf<T>>> = TypedCustomEventListenerOrEventListenerObject<T, K>;
export interface CustomEventListener<D> {
    (evt: CustomEvent<D>): void;
}
export interface CustomEventListenerObject<D> {
    handleEvent(object: CustomEvent<D>): void;
}
export type CustomEventListenerOrEventListenerObject<D> = CustomEventListener<D> | CustomEventListenerObject<D>;
export {};
//# sourceMappingURL=tcet.d.ts.map