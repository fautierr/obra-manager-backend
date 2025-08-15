import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('project_statuses', { schema: 'construction' })
@ObjectType()
export class ProjectStatus {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @Column()
  @Field(() => String)
  description: string
}
