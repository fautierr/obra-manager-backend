import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@ObjectType()
@Entity({ schema: 'construction', name: 'projects' })
export class Project {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  name: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string
}
