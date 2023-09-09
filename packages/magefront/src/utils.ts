/** Check if value is an array */
export const isArray = (value: any): value is any[] => Array.isArray(value)

/** Check if value is an object */
export const isObject = (value: any): value is Record<string, any> => typeof value === 'object' && value !== null
