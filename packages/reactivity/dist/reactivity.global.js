var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    ReactiveEffect: () => ReactiveEffect,
    activeEffect: () => activeEffect,
    computed: () => computed,
    effect: () => effect,
    reactive: () => reactive,
    track: () => track,
    trackEffect: () => trackEffect,
    trigger: () => trigger,
    triggerEffects: () => triggerEffects
  });

  // packages/shared/src/index.ts
  var isObject = (v) => typeof v === "object" && v !== null;
  var isFunction = (v) => {
    return typeof v === "function";
  };
  var noop = () => {
  };

  // packages/reactivity/src/effect.ts
  var activeEffect;
  function cleanup(effect2) {
    const deps = effect2.deps;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanup(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanup(this);
      }
    }
  };
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    _effect.run();
    return runner;
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, type, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = /* @__PURE__ */ new Set());
    }
    trackEffect(deps);
  }
  function trackEffect(deps) {
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    const effects = depsMap.get(key);
    if (effects) {
      triggerEffects(effects);
    }
  }
  function triggerEffects(effects) {
    const _effects = new Set(effects);
    _effects.forEach((effect2) => {
      if (effect2 !== activeEffect) {
        if (effect2.scheduler) {
          effect2.scheduler();
        } else {
          effect2.run();
        }
      }
    });
  }

  // packages/reactivity/src/baseHandler.ts
  var mutableHandlers = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, "get", key);
      let res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        res = reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const res = Reflect.set(target, key, value, receiver);
      if (value !== oldValue) {
        trigger(target, "set", key, value, oldValue);
      }
      return res;
    }
  };

  // packages/reactivity/src/warn.ts
  function warn(msg, ...args) {
    console.warn(`Vue warn ${msg}: `, ...args);
  }

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      warn("reactive", `target should be an object`);
      return;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existingProxy = reactiveMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/computed.ts
  function computed(getterOrOption) {
    let getter;
    let setter;
    if (isFunction(getterOrOption)) {
      getter = getterOrOption;
      setter = noop;
    } else {
      getter = getterOrOption.get;
      setter = getterOrOption.set || noop;
    }
    return new ComputedRefImpl(getter, setter);
  }
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.getter = getter;
      this.setter = setter;
      this._dirty = true;
      this.__v_isReadonly = true;
      this.__v_isRef = true;
      this._deps = /* @__PURE__ */ new Set();
      this._effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this._deps);
        }
      });
    }
    get value() {
      trackEffect(this._deps);
      if (this._dirty) {
        this._value = this._effect.run();
        this._dirty = false;
      }
      return this._value;
    }
    set value(newVal) {
      this.setter(newVal);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
