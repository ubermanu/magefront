/** Check if value is an array */
export const isArray = (value: any): value is any[] => Array.isArray(value)

/** Check if value is an object */
export const isObject = (value: any): value is Record<string, any> => typeof value === 'object' && value !== null

/** Merge two objects recursively */
export const assign = <T>(target: object, source: object): T => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        }
        assign(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return target as T
}
