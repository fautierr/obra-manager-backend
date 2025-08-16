import { InputType, Field, ID, Int } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
} from 'class-validator'

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  statusId?: number
}
