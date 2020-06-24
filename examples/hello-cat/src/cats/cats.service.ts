import { inject, injectable, InjectionToken } from '../../../../src/decorators'
import { TestService } from './token'

@injectable()
export class CatsService {
  constructor(@inject(TestService) private readonly testService: any) {}

  async findAll() {
    console.log(await this.testService)
    return [{
      name: 'Lu',
    }]
  }
}
