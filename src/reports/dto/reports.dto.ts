import { ObjectType, Field, Float, ID } from '@nestjs/graphql'

@ObjectType()
export class MaterialReportsDTO {
  @Field()
  name: string

  @Field(() => Float)
  quantity: number

  @Field(() => Float)
  total: number

  @Field(() => Float)
  percentage: number
}

@ObjectType()
export class ProjectReportsItemDTO {
  @Field(() => ID)
  projectId: string

  @Field(() => Float)
  total: number

  @Field(() => [MaterialReportsDTO])
  materials: MaterialReportsDTO[]
}

@ObjectType()
export class ProjectReportsDTO {
  @Field(() => ProjectReportsItemDTO)
  project1: ProjectReportsItemDTO

  @Field(() => ProjectReportsItemDTO)
  project2: ProjectReportsItemDTO

  @Field(() => Float)
  differencePercentage: number
}
