import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsResolver } from './projects.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { User } from 'src/users/entities/user.entity'
import { ProjectStatus } from 'src/project-statuses/entities/project-status.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Project, User, ProjectStatus])],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectsModule {}
