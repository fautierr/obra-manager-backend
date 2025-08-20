import { ObjectType, Field, ID, Float } from '@nestjs/graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'
import { Category } from 'src/categories/entities/category.entity'

@ObjectType()
@Entity('project_materials', { schema: 'construction' })
export class ProjectMaterial {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => Project)
  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project: Project

  @Field(() => Material)
  @ManyToOne(() => Material, { eager: true })
  @JoinColumn({ name: 'material_id' })
  material: Material

  @Field(() => Float)
  @Column('numeric')
  quantity: number

  @Field(() => Float, { nullable: true })
  @Column('numeric', { name: 'unit_price', nullable: true })
  unit_price?: number

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Field(() => Category)
  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category
}
