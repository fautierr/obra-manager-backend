import { Module } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { ReportsResolver } from './reports.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'
import { ReportsRepository } from './reports.repository'
import { ProjectsModule } from 'src/projects/projects.module'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMaterial]), ProjectsModule],
  providers: [ReportsResolver, ReportsService, ReportsRepository],
})
export class ReportsModule {}
