import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('units', { schema: 'construction' })
@ObjectType()
export class Unit {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @Column()
  @Field(() => String)
  abbreviation: string
}
