import { isObject } from '@vue/shared'
import { warn } from './warn'

const enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
}

const reactiveMap = new WeakMap<any, any>()
export function reactive(target) {
  if (!isObject(target)) {
    warn('reactive', `target should be an object`)
    return
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const existingProxy = reactiveMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true
      }

      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver)
    },
  })

  reactiveMap.set(target, proxy)
  return proxy
}
