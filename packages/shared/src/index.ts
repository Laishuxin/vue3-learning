export const isObject = (v: unknown): v is Record<any, any> =>
  typeof v === 'object' && v !== null

export const isFunction = (v: unknown): v is Function => {
  return typeof v === 'function'
}

export const isString = (v: unknown): v is string => {
  return typeof v === 'string'
}

export const isNumber = (v: unknown): v is number => {
  return typeof v === 'number'
}
export const noop = () => {}
