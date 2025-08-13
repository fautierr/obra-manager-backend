import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Project } from '../entities/project.entity'

@ObjectType()
export class ProjectsPagination {
  @Field(() => [Project])
  data: Project[]

  @Field(() => Int)
  total: number

  @Field(() => Int)
  page: number

  @Field(() => Int)
  lastPage: number
}
