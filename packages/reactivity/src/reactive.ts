import { isObject } from '@vue/shared'
import { mutableHandlers, ReactiveFlags } from 'packages/reactivity/src/baseHandler'
import { warn } from './warn'

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

  const proxy = new Proxy(target, mutableHandlers)

  reactiveMap.set(target, proxy)
  return proxy
}
