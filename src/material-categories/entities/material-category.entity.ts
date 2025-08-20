import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Material } from 'src/materials/entities/material.entity'
import { Category } from 'src/categories/entities/category.entity'

@ObjectType()
@Entity('material_categories', { schema: 'construction' })
export class MaterialCategory {
  @Field(() => Int)
  @PrimaryColumn({ name: 'material_id', type: 'int' })
  materialId: number

  @Field(() => Int)
  @PrimaryColumn({ name: 'category_id', type: 'int' })
  categoryId: number

  @Field(() => Material)
  @ManyToOne(() => Material, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material: Material

  @Field(() => Category)
  @ManyToOne(() => Category, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @OneToMany(() => MaterialCategory, (mc) => mc.category)
  materialCategories: MaterialCategory[]
}
