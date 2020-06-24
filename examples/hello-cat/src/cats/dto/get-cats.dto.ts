import { IsString } from 'class-validator'

export class GetCatsDto {
  @IsString()
  name!: string
}
