import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

const validatorMetadataKey = Symbol('validator')

export function validator() {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args: any[]) {
      const validateIndexes: number[] | undefined = Reflect.getOwnMetadata(
        validatorMetadataKey,
        target,
        propertyKey,
      )
      const types: any[] | undefined = Reflect.getMetadata(
        'design:paramtypes',
        target,
        propertyKey,
      )

      if (validateIndexes && validateIndexes.length > 0) {
        const validatorP = validateIndexes.map(index => {
          if (!types) {
            throw new Error('Can not detect parameter type')
          }

          const value = args[index]
          const classType = types[index]

          if (!value) {
            throw new Error('Missing body or parameters')
          }
          const obj = plainToClass(classType, value)

          return validate(obj, {
            validationError: {
              target: false
            }
          })
        })

        const errors = await Promise.all(validatorP)

        if (errors.length > 0) {
          errors.map(e => {
            if (e.length > 0) {
              throw {
                message: errors
              }
            }
          })

        }
      }

      return originalMethod.apply(this, args)
    }
  }
}
