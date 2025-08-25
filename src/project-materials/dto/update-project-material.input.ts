import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { Type } from 'class-transformer'

@InputType()
export class UpdateProjectMaterialInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  quantity?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  unitPrice?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  categoryId?: number
}

@InputType()
export class UpdateManyProjectMaterialsInput {
  @Field(() => [UpdateProjectMaterialInput])
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectMaterialInput)
  materials: UpdateProjectMaterialInput[]
}
