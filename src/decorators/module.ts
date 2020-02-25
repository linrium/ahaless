import { container } from './container'
import { MethodData } from './handler'
import { ModuleType, Provider, Type } from './types'

export interface SlsModuleOpts {
  imports?: Array<ModuleType<any>>
  handlers?: Array<Type<any>>
  providers?: Array<Type<any> | Provider<any>>
  root?: boolean
  exportObject?: any
}

export function addProviders(slsModuleOpts: SlsModuleOpts) {
  const { handlers = [], providers = [], exportObject } = slsModuleOpts

  providers.forEach((provider: any) => {
    if (provider.provide) {
      container.addProvider(provider)
    } else {
      container.addProvider({
        provide: provider,
        useClass: provider,
      })
    }
  })

  handlers.forEach(handler => {
    container.addProvider({
      provide: handler,
      useClass: handler,
    })

    const instance = container.inject(handler)

    exportObject.metadata.push(instance.methodMeta)

    instance.methodMeta?.forEach((method: MethodData) => {
      exportObject[method.fnName] = instance[method.fnName]
    })
  })
}

export interface AhalessModule {
  new (...args: any[]): any
  exports?: string
}

export function module(slsModuleOpts: SlsModuleOpts) {
  const { imports = [], handlers = [], providers = [] } = slsModuleOpts
  return <T extends AhalessModule>(constructor: T) => {
    const exportObject: any = constructor.exports

    if (exportObject) {
      exportObject.metadata = []

      imports.forEach(importObject => {
        addProviders({ ...importObject, exportObject })
      })
      addProviders({ providers, handlers, exportObject })

      return constructor
    }

    return class extends constructor {
      public static providers = providers
      public static handlers = handlers
    }
  }
}
