import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('categories', { schema: 'construction' })
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column({ type: 'text' })
  @Field(() => String)
  name: string
}
