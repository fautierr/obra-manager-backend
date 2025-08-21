import { ObjectType, Field, Int } from '@nestjs/graphql'
import { UnitDTO } from 'src/units/dto/unit.dto'

@ObjectType()
export class MaterialDTO {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => UnitDTO)
  unit: UnitDTO

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  created_at?: Date
}
