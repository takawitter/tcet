class s extends EventTarget {
  dispatchEvent(e, t) {
    return super.dispatchEvent(
      e instanceof Event ? e : new CustomEvent(e, t)
    );
  }
}
export {
  s as TypedCustomEventTarget
};
