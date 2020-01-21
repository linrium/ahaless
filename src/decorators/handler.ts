import { INJECTABLE_METADATA_KEY } from './container'
import { handlerMetaKey } from './metadataKey'

export type MethodData = {
  fnName: string | symbol
  method: string
  path: string | symbol
  opts: any
}

export function handler() {
  return <T extends { new (...args: any[]): {}; methodMeta?: MethodData[] }>(constructor: T) => {
    const methodMeta: MethodData[] = Reflect.getMetadata(handlerMetaKey, constructor.prototype) ?? []

    constructor.methodMeta = methodMeta
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, constructor)

    return class extends constructor {
      methodMeta = methodMeta
    }
  }
}
