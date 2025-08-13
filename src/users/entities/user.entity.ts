import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Project } from 'src/projects/entities/project.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@ObjectType()
@Entity({ schema: 'construction', name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  email: string
  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[]
}
