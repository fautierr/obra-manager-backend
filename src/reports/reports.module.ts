import { Module } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { ReportsResolver } from './reports.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMaterial])],
  providers: [ReportsResolver, ReportsService],
})
export class ReportsModule {}
