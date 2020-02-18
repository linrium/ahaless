export type Type<T> = new (...args: any[]) => T

export interface ModuleType<T> extends Function {
  providers?: Array<Type<T>>
  handlers?: Array<Type<T>>
  new (...args: any[]): T
}

export class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectionToken

export interface BaseProvider<T> {
  provide: Token<T>
}

export interface ClassProvider<T> extends BaseProvider<T> {
  useClass: Type<T>
}

export interface ValueProvider<T> extends BaseProvider<T> {
  useValue: T
}

export type Factory<T> = () => T

export interface FactoryProvider<T> extends BaseProvider<T> {
  useFactory: Factory<T>
}

export type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>
