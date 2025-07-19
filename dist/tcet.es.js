class n extends EventTarget {
  dispatchCustomEvent(t, e) {
    return super.dispatchEvent(new CustomEvent(t, { detail: e }));
  }
}
export {
  n as TypedCustomEventTarget
};
