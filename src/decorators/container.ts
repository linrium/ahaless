import { getInjectionToken, isInjectable } from './injectable'
import {
  BaseProvider,
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  Provider,
  Token,
  Type,
  ValueProvider,
} from './types'

export function isClassProvider<T>(provider: BaseProvider<T>): provider is ClassProvider<T> {
  return (provider as any).useClass !== undefined
}

export function isValueProvider<T>(provider: BaseProvider<T>): provider is ValueProvider<T> {
  return (provider as any).useValue !== undefined
}

export function isFactoryProvider<T>(provider: BaseProvider<T>): provider is FactoryProvider<T> {
  return (provider as any).useFactory !== undefined
}

const REFLECT_PARAMS = 'design:paramtypes'

export type InjectableParam = Type<any>

export class Container {
  private providers = new Map<Token<any>, Provider<any>>()

  private static assertInjectableIfClassProvider<T>(provider: Provider<T>) {
    if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
      throw new Error(
        `Cannot provide ${Container.getTokenName(provider.provide)} using class ${Container.getTokenName(
          provider.useClass,
        )}, ${Container.getTokenName(provider.useClass)} isn't injectable`,
      )
    }
  }

  private static getTokenName<T>(token: Token<T>) {
    return token instanceof InjectionToken ? token.injectionIdentifier : token.name
  }

  public addProvider<T>(provider: Provider<T>) {
    Container.assertInjectableIfClassProvider(provider)
    this.providers.set(provider.provide, provider)
  }

  public async inject<T>(type: Token<T>): Promise<T> {
    let provider = this.providers.get(type)

    if (provider === undefined && !(type instanceof InjectionToken)) {
      provider = {
        provide: type,
        useClass: type,
      }

      Container.assertInjectableIfClassProvider(provider)
    }

    return await this.injectWithProvider(type, provider)
  }

  private injectWithProvider<T>(type: Token<T>, provider?: Provider<T>): T {
    if (provider === undefined) {
      throw new Error(`No provider for type ${Container.getTokenName(type)}`)
    }

    console.log(type, provider)
    if (isClassProvider(provider)) {
      return this.injectClass(provider as ClassProvider<T>)
    }

    if (isValueProvider(provider)) {
      return Container.injectValue(provider as ValueProvider<T>)
    }

    return Container.injectFactory(provider as FactoryProvider<T>)
  }

  private static injectValue<T>(valueProvider: ValueProvider<T>): T {
    return valueProvider.useValue
  }

  private static injectFactory<T>(valueProvider: FactoryProvider<T>): T {
    return valueProvider.useFactory()
  }

  private injectClass<T>(classProvider: ClassProvider<T>): T {
    const target = classProvider.useClass
    const params = this.getInjectedParams(target)

    return Reflect.construct(target, params)
  }

  private getInjectedParams<T>(target: Type<T>) {
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as Array<InjectableParam | undefined>

    if (argTypes === undefined) {
      return []
    }

    return argTypes.map((argType, index) => {
      if (argType === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected in constructor for type ${target.name} with parameter at index ${index}`,
        )
      }

      const overrideToken = getInjectionToken(target, index)
      const actualToken = overrideToken === undefined ? argType : overrideToken
      const provider = this.providers.get(actualToken)

      return this.injectWithProvider(actualToken, provider)
    })
  }
}

export const container = new Container()

export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_KEY')
