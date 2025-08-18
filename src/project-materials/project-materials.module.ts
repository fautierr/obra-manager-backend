import { Module } from '@nestjs/common'
import { ProjectMaterialsService } from './project-materials.service'
import { ProjectMaterialsResolver } from './project-materials.resolver'
import { ProjectMaterial } from './entities/project-material.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMaterial, Project, Material])],
  providers: [ProjectMaterialsResolver, ProjectMaterialsService],
})
export class ProjectMaterialsModule {}
