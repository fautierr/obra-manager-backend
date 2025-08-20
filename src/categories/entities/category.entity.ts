import { ObjectType, Field, Int } from '@nestjs/graphql'
// import { MaterialCategory } from 'src/material-categories/entities/material-category.entity'
// import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'
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

  // @OneToMany(() => ProjectMaterial, (pm) => pm.category)
  // projectMaterials: ProjectMaterial[]

  // @OneToMany(() => MaterialCategory, (mc) => mc.category)
  // materialCategories: MaterialCategory[]
}
