import { ObjectType, Field, Int } from '@nestjs/graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Unit } from 'src/units/entities/unit.entity'

@ObjectType()
@Entity({ schema: 'construction', name: 'materials' })
export class Material {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field(() => Unit)
  @ManyToOne(() => Unit, { eager: true })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string

  @Field({ nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at?: Date
}
