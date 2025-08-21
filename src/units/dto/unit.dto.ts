import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UnitDTO {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  abbreviation: string
}
