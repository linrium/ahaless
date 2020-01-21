import { MethodData } from './handler'
import { bodyMetadataKey, handlerMetaKey, paramMetadataKey } from './metadataKey'

export function method(method: string, path?: string, opts?: any): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const methodMeta: MethodData[] = Reflect.getMetadata(handlerMetaKey, target) ?? []
    methodMeta.push({
      fnName: propertyKey,
      method,
      path: path ?? propertyKey,
      opts,
    })
    Reflect.defineMetadata(handlerMetaKey, methodMeta, target)

    const fn: any = async function(event: any, context: any) {
      try {
        context.callbackWaitsForEmptyEventLoop = false
        const bodyIndexes: number[] = Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) ?? []
        const paramIndexes: number[] = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) ?? []

        const body = JSON.parse(event.body)

        const argArray: number[] = []

        if (bodyIndexes?.length > 0) {
          bodyIndexes.forEach(index => {
            argArray[index] = body
          })
        }

        if (paramIndexes?.length > 0) {
          paramIndexes.forEach(index => {
            argArray[index] = event.queryStringParameters
          })
        }

        const result = await originalMethod.apply(this, argArray)

        return {
          statusCode: 200,
          body: JSON.stringify(result),
        }
      } catch (e) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: e.message,
          }),
        }
      }
    }

    return {
      configurable: true,
      get() {
        return fn.bind(this)
      },
    }
  }
}

export const get = (path?: string, opts?: any): MethodDecorator => {
  return method('get', path, opts)
}

export function put(path?: string, opts?: any): MethodDecorator {
  return method('put', path, opts)
}

export function post(path?: string, opts?: any): MethodDecorator {
  return method('post', path, opts)
}

export function del(path?: string, opts?: any): MethodDecorator {
  return method('delete', path, opts)
}
