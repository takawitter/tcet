import { expect, test, vi } from "vitest";
import { TypedCustomEvent, TypedCustomEventTarget } from "../src/tcet.ts";

class MyEventTarget extends TypedCustomEventTarget<MyEventTarget, {greeting: string}>{}

test("dispatchEvent() should create and dispatch events to listener.", ()=>{
    const et = new MyEventTarget();
    const handler = vi.fn();
    et.addEventListener("greeting", handler);
    et.dispatchEvent("greeting", {detail: "hello"});
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toBe("hello");
});

test("dispatchEvent() should dispatch events to listener.", ()=>{
    const et = new MyEventTarget();
    const handler = vi.fn();
    et.addEventListener("greeting", handler);
    et.dispatchEvent(new TypedCustomEvent("greeting", {detail: "hello"}));
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toBe("hello");
});
