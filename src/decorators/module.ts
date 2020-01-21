import { container } from './container'
import { MethodData } from './handler'
import { ModuleType, Type } from './types'

export type SlsModuleOpts = {
  imports?: ModuleType<any>[]
  handlers?: Type<any>[]
  providers?: Type<any>[]
  root?: boolean
  exportObject?: any
}

export function module({ imports = [], handlers = [], providers = [], root, exportObject }: SlsModuleOpts) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    if (root) {
      imports.forEach(({ providers = [], handlers = [] }) => {
        providers.forEach(provider => {
          container.addProvider({
            provide: provider,
            useClass: provider,
          })
        })

        handlers.forEach(handler => {
          container.addProvider({
            provide: handler,
            useClass: handler,
          })

          const instance = container.inject(handler)

          instance.methodMeta?.forEach(function(method: MethodData) {
            exportObject[method.fnName] = instance[method.fnName]
          })
        })
      })

      return constructor
    }

    return class extends constructor {
      static providers = providers
      static handlers = handlers
    }
  }
}
