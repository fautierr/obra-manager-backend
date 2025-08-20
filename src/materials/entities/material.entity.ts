import { ObjectType, Field, Int } from '@nestjs/graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  // OneToMany,
} from 'typeorm'
import { Unit } from 'src/units/entities/unit.entity'
// import { MaterialCategory } from 'src/material-categories/entities/material-category.entity'
// import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'

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

  // @OneToMany(() => MaterialCategory, (mc) => mc.material)
  // materialCategories: MaterialCategory[]

  // @OneToMany(() => ProjectMaterial, (pm) => pm.material)
  // projectMaterials: ProjectMaterial[]
}
