import { bodyMetadataKey, paramMetadataKey } from './metadataKey'

export function body(): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    const bodyIndexes: number[] = Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) ?? []
    bodyIndexes.push(parameterIndex)
    Reflect.defineMetadata(bodyMetadataKey, bodyIndexes, target, propertyKey)
  }
}

export function param(): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    const paramIndexes: number[] = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) ?? []
    paramIndexes.push(parameterIndex)
    Reflect.defineMetadata(paramMetadataKey, paramIndexes, target, propertyKey)
  }
}
