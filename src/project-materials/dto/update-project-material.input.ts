import { IsInt, IsNotEmpty } from 'class-validator'
import { CreateProjectMaterialInput } from './create-project-material.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateProjectMaterialInput extends PartialType(
  CreateProjectMaterialInput,
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number
}
