import { INJECTABLE_METADATA_KEY } from './container'
import { handlerMetaKey } from './metadataKey'

export interface MethodData {
  fnName: string | symbol
  method: string
  path: string | symbol
  opts: any
}

export function handler() {
  return <T extends { methodMeta?: MethodData[]; new (...args: any[]): {} }>(constructor: T) => {
    const methodMeta: MethodData[] = Reflect.getMetadata(handlerMetaKey, constructor.prototype) ?? []

    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, constructor)

    return class extends constructor {
      public methodMeta = methodMeta
    }
  }
}
