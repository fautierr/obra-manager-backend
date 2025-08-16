import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ProjectStatus } from 'src/project-statuses/entities/project-status.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

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
  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Field(() => ProjectStatus)
  @ManyToOne(() => ProjectStatus, { eager: true, nullable: true })
  @JoinColumn({ name: 'status_id' })
  status?: ProjectStatus

  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @Column({ default: false })
  @Field(() => Boolean)
  is_deleted: boolean
}
