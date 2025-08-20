import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class ProjectCategoryProgress {
  @Field(() => Int)
  categoryId: number

  @Field()
  categoryName: string
}
