import { Module } from '@nestjs/common'
import { ProjectMaterialsService } from './project-materials.service'
import { ProjectMaterialsResolver } from './project-materials.resolver'
import { ProjectMaterial } from './entities/project-material.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'
import { Category } from 'src/categories/entities/category.entity'
import { MaterialCategory } from 'src/material-categories/entities/material-category.entity'
import { ProjectsModule } from 'src/projects/projects.module'
import { MaterialsModule } from 'src/materials/materials.module'
import { CategoriesModule } from 'src/categories/categories.module'
import { MaterialCategoriesModule } from 'src/material-categories/material-categories.module'
import { ProjectMaterialsRepository } from './project-materials.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectMaterial,
      Project,
      Material,
      Category,
      MaterialCategory,
    ]),
    ProjectsModule,
    MaterialsModule,
    CategoriesModule,
    MaterialCategoriesModule,
  ],
  providers: [
    ProjectMaterialsResolver,
    ProjectMaterialsService,
    ProjectMaterialsRepository,
  ],
})
export class ProjectMaterialsModule {}
