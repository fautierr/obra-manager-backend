import { Module } from '@nestjs/common'
import { ProjectStatusesService } from './project-statuses.service'
import { ProjectStatusesResolver } from './project-statuses.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectStatus } from './entities/project-status.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectStatus])],
  providers: [ProjectStatusesResolver, ProjectStatusesService],
})
export class ProjectStatusesModule {}
