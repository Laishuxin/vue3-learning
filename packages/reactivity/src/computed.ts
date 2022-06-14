import { isFunction, noop } from '@vue/shared'
import { ReactiveEffect, trackEffect, triggerEffects } from '@vue/reactivity'

export function computed(
  getterOrOption: Function | { get: Function; set: Function },
) {
  let getter: Function
  let setter: Function
  if (isFunction(getterOrOption)) {
    getter = getterOrOption
    setter = noop
  } else {
    getter = getterOrOption.get
    setter = getterOrOption.set || noop
  }
  return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
  public _dirty = true
  public _effect
  public __v_isReadonly = true
  public __v_isRef = true
  public _deps = new Set()
  public _value
  constructor(public getter: Function, public setter: Function) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this._deps)
      }
    })
  }

  get value() {
    trackEffect(this._deps)
    // debugger
    if (this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }
    return this._value
  }

  set value(newVal) {
    this.setter(newVal)
  }
}
