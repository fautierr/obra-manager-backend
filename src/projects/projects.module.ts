import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsResolver } from './projects.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectsModule {}
