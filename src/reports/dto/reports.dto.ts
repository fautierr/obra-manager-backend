// project-totals.dto.ts
import { ObjectType, Field, Float, ID } from '@nestjs/graphql'

@ObjectType()
export class MaterialBreakdown {
  @Field(() => ID)
  materialId: number

  @Field()
  materialName: string

  @Field(() => Float)
  quantity: number

  @Field(() => Float)
  totalCost: number

  @Field(() => Float)
  percentageOfProject: number
}

@ObjectType()
export class ProjectComparison {
  @Field(() => ID)
  project1Id: string

  @Field(() => Float)
  project1Total: number

  @Field(() => ID)
  project2Id: string

  @Field(() => Float)
  project2Total: number

  @Field(() => Float)
  difference: number

  @Field(() => Float)
  differencePercentage: number

  @Field(() => ID)
  higherProjectId: string

  @Field(() => [MaterialBreakdown])
  project1Materials: MaterialBreakdown[]

  @Field(() => [MaterialBreakdown])
  project2Materials: MaterialBreakdown[]
}

@ObjectType()
export class ProjectTotals {
  @Field(() => ID)
  projectId: string

  @Field(() => Float)
  totalCost: number

  @Field(() => [MaterialBreakdown])
  materials: MaterialBreakdown[]
}
