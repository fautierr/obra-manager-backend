import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt } from 'class-validator'

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  statusId?: number
}
