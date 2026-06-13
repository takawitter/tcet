const s = CustomEvent;
class o extends EventTarget {
  dispatchEvent(t, e) {
    return super.dispatchEvent(
      t instanceof Event ? t : new CustomEvent(t, e)
    );
  }
}
export {
  s as TypedCustomEvent,
  o as TypedCustomEventTarget
};
