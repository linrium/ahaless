import '@abraham/reflection'
import { CatsModule } from './src/cats/cats.module'
import { InjectionToken, module, Token } from '../../src/decorators'
import { DatabaseModule } from './src/database/database.module'

@module({
  imports: [DatabaseModule, CatsModule],
})
export class Handler {
  static exports = exports
}
