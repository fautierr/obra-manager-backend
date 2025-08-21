import { ObjectType, Field, Float, OmitType } from '@nestjs/graphql'
import { MaterialDTO } from 'src/materials/dto/material.dto'

@ObjectType()
// export class CategoryDetail extends MaterialDTO {
export class CategoryDetail extends OmitType(MaterialDTO, [
  'id',
  'created_at',
] as const) {
  @Field(() => Float)
  quantity: number

  @Field(() => Float)
  unitPrice: number
}
