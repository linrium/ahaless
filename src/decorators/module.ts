import { container } from './container'
import { MethodData } from './handler'
import { ModuleType, Type } from './types'

export interface SlsModuleOpts {
  imports?: Array<ModuleType<any>>
  handlers?: Array<Type<any>>
  providers?: Array<Type<any>>
  root?: boolean
  exportObject?: any
}

function addProviders(slsModuleOpts: SlsModuleOpts) {
  const { handlers = [], providers = [], exportObject } = slsModuleOpts

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

    instance.methodMeta?.forEach((method: MethodData) => {
      exportObject[method.fnName] = instance[method.fnName]
    })
  })
}

export function module(slsModuleOpts: SlsModuleOpts) {
  const { imports = [], handlers = [], providers = [], root, exportObject } = slsModuleOpts
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    // if (root) {
    //   imports.forEach(importObject => {
    //     addProviders({ ...importObject, exportObject })
    //   })
    //   addProviders({ providers, handlers, exportObject })
    //
    //   return constructor
    // }

    return class extends constructor {
      public static providers = providers
      public static handlers = handlers
      public run(exports: any) {
        imports.forEach(importObject => {
          addProviders({ ...importObject, exportObject: exports })
        })
        addProviders({ providers, handlers, exportObject: exports })
      }
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
export class AhalessModule {
  // tslint:disable-next-line:no-empty
  public run(exports: any) {

  }
}
