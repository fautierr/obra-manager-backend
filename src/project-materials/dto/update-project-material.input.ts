import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator'
import { CreateProjectMaterialItemInput } from './create-project-material.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

@InputType()
export class UpdateProjectMaterialInput extends PartialType(
  CreateProjectMaterialItemInput,
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number
}

@InputType()
export class UpdateManyProjectMaterialsInput {
  @Field(() => [UpdateProjectMaterialInput])
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectMaterialInput)
  materials: UpdateProjectMaterialInput[]
}
