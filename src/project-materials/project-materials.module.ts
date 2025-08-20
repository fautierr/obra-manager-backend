import { Module } from '@nestjs/common'
import { ProjectMaterialsService } from './project-materials.service'
import { ProjectMaterialsResolver } from './project-materials.resolver'
import { ProjectMaterial } from './entities/project-material.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'
import { Category } from 'src/categories/entities/category.entity'
import { MaterialCategory } from 'src/material-categories/entities/material-category.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectMaterial,
      Project,
      Material,
      Category,
      MaterialCategory,
    ]),
  ],
  providers: [ProjectMaterialsResolver, ProjectMaterialsService],
})
export class ProjectMaterialsModule {}
