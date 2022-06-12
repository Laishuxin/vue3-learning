export let activeEffect: ReactiveEffect | null

function cleanup(effect: ReactiveEffect) {
  const deps = effect.deps
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
  // effect.deps.forEach((dep) => {
  //   dep.delete(effect)
  // })
  // effect.deps.length = 0
}

class ReactiveEffect {
  // is activated?
  // if false, run collecting dependencies
  public active = true
  constructor(public fn) {}
  public parent: any
  public deps: Set<any>[] = []

  run() {
    // 不需要收集依赖
    if (!this.active) {
      return this.fn()
    }

    // 需要收集依赖
    try {
      this.parent = activeEffect
      activeEffect = this
      cleanup(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn, options = {}) {
  // 可以根据状态发生变化，同时 effect 可以嵌套。
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

const targetMap = new WeakMap<any, Map<string, Set<ReactiveEffect>>>()
export function track(target, type, key) {
  // 可能不是在 effect 中使用。
  if (!activeEffect) return

  let depsMap: Map<any, any> = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps: Set<any> = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  let shouldTrack = !deps.has(activeEffect)
  if (shouldTrack) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)

  if (effects) {
    const _effects = new Set(effects)
    _effects.forEach((effect) => {
      if (effect !== activeEffect) effect.run()
    })
  }
}
