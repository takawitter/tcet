import { beforeEach, expect, test } from "vitest";
import { TypedCustomEvent, TypedCustomEventInit, TypedCustomEventTarget } from "../src/tcet.ts";

class MyEt extends TypedCustomEventTarget<MyEt, {
    greeting: string
}>{
    greetingEvent(init: TypedCustomEventInit<string>){
        return new TypedCustomEvent<MyEt, "greeting">("greeting", init);
    }
}

function newEt(){
    return new MyEt();
}

test("dispatchEvent() should return true when no listener.", ()=>{
    const et = newEt();
    const e = et.greetingEvent({detail: "hello"});
    const cont = et.dispatchEvent(e);
    expect(cont).toBe(true);
    expect(e.defaultPrevented).toBe(false);
});

test("dispatchEvent() should return false when a listener called preventDefault().", ()=>{
    const et = newEt();
    const e = et.greetingEvent({cancelable: true, detail: "hello"});
    et.addEventListener("greeting", e=>{
        console.log(e);
        e.preventDefault();
    }, {passive: false});
    const cont = et.dispatchEvent(e);
    expect(cont).toBe(false);
    expect(e.defaultPrevented).toBe(true);
});

test("dispatchEvent() should return false when a listener called preventDefault().", ()=>{
    const et = newEt();
    const e = et.greetingEvent({cancelable: true, detail: "hello"});
    et.addEventListener("greeting", e=>{
        console.log(e);
        e.preventDefault();
    }, {passive: false});
    let propagationStopped = false;
    e.stopPropagation = ()=>{
        propagationStopped = true;
    };
    const cont = et.dispatchEvent(e);
    expect(cont).toBe(false);
    expect(e.defaultPrevented).toBe(true);
});
