import { module } from '../../../../src/decorators'
import { DatabaseService } from './database.service'

@module({
  providers: [DatabaseService],
})
export class DatabaseModule {}
