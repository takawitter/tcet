//#region src/tcet.ts
var e = CustomEvent, t = class extends EventTarget {
	dispatchEvent(e, t) {
		return super.dispatchEvent(e instanceof Event ? e : new CustomEvent(e, t));
	}
};
//#endregion
export { e as TypedCustomEvent, t as TypedCustomEventTarget };
