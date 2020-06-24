import { MethodData } from './handler'
import { bodyMetadataKey, handlerMetaKey, paramMetadataKey, eventMetadataKey, snsMetadataKey } from './metadataKey'

export function method(mtd: string, path?: string, opts?: any): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    const methodMeta: MethodData[] = Reflect.getMetadata(handlerMetaKey, target) ?? []
    methodMeta.push({
      fnName: propertyKey,
      method: mtd,
      path: path ?? propertyKey,
      opts,
    })
    Reflect.defineMetadata(handlerMetaKey, methodMeta, target)

    const fn: any = async function(event: any, context: any) {
      try {
        context.callbackWaitsForEmptyEventLoop = false
        const bodyIndexes: number[] = Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) ?? []
        const paramIndexes: number[] = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) ?? []
        const eventIndexes: number[] = Reflect.getOwnMetadata(eventMetadataKey, target, propertyKey) ?? []
        const snsIndexes: number[] = Reflect.getOwnMetadata(snsMetadataKey, target, propertyKey) ?? []

        let body: any
        try {
          body = JSON.parse(event.body)
        } catch (e) {
          body = event.body
        }

        const argArray: number[] = []

        if (Array.isArray(bodyIndexes)) {
          bodyIndexes.forEach(index => {
            argArray[index] = body
          })
        }

        if (Array.isArray(paramIndexes)) {
          paramIndexes.forEach(index => {
            argArray[index] = event.queryStringParameters
          })
        }

        if (Array.isArray(eventIndexes)) {
          eventIndexes.forEach(index => {
            argArray[index] = event
          })
        }

        if (Array.isArray(snsIndexes)) {
          let data: any = body

          if (event.Records?.[0].EventSource === 'aws:sns') {
            try {
              data = JSON.parse(event.Records[0].Sns.Message)
            } catch (e) {
              data = event.Records[0].Sns.Message
            }
          }

          snsIndexes.forEach(index => {
            argArray[index] = data
          })
        }

        const result = await originalMethod.apply(this, argArray)

        return {
          statusCode: 200,
          body: JSON.stringify(result),
        }
      } catch (e) {
        if (e instanceof Error) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: e.message,
            }),
          }
        }

        return {
          statusCode: e.statusCode ?? 400,
          body: JSON.stringify(e),
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
