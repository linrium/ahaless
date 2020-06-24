import { body, handler, post, get, validator, param } from '../../../../src/decorators'
import { CreateCatDto } from './dto/create-cat.dto'
import { CatsService } from './cats.service'
import { GetCatsDto } from './dto/get-cats.dto'

@handler()
export class CatsHandler {
  constructor(private readonly catsService: CatsService) {}

  @get('get_cats')
  @validator()
  async getCats() {
    return this.catsService.findAll()
  }
}
