import { InputType, Field, ID, Float, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsInt, IsNumber, IsUUID } from 'class-validator'

@InputType()
export class CreateProjectMaterialItemInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  materialId: number

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @Field(() => Float, { nullable: true })
  @IsNumber()
  unitPrice?: number
}
@InputType()
export class CreateProjectMaterialInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  projectId: string

  @Field(() => [CreateProjectMaterialItemInput])
  @IsNotEmpty()
  materials: CreateProjectMaterialItemInput[]
}
