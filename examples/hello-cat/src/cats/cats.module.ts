import { InjectionToken, module } from '../../../../src/decorators'
import { CatsHandler } from './cats.handler'
import { CatsService } from './cats.service'
import { TestService } from './token'

@module({
  handlers: [CatsHandler],
  providers: [
    CatsService,
    {
      provide: TestService,
      useFactory: async () => {
        const value = await new Promise(resolve => {
          setTimeout(() => {
            resolve(1)
          }, 3000)
        })

        return value
      },
    }],
})
export class CatsModule {
}
