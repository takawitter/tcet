class n extends EventTarget {
  dispatchCustomEvent(t, ...e) {
    return super.dispatchEvent(new CustomEvent(t, ...e));
  }
}
export {
  n as TypedCustomEventTarget
};
