import { bodyMetadataKey, paramMetadataKey, validatorMetadataKey } from './metadataKey'

export function validate(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const validateIndexes: number[] =
    Reflect.getOwnMetadata(validatorMetadataKey, target, propertyKey) ?? []
  validateIndexes.push(parameterIndex)
  Reflect.defineMetadata(
    validatorMetadataKey,
    validateIndexes,
    target,
    propertyKey,
  )
}

export function body(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const bodyIndexes: number[] = Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) ?? []
    bodyIndexes.push(parameterIndex)
    Reflect.defineMetadata(bodyMetadataKey, bodyIndexes, target, propertyKey)

    validate(target, propertyKey, parameterIndex)
  }
}

export function param(): ParameterDecorator {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const paramIndexes: number[] = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) ?? []
    paramIndexes.push(parameterIndex)
    Reflect.defineMetadata(paramMetadataKey, paramIndexes, target, propertyKey)

    validate(target, propertyKey, parameterIndex)
  }
}
