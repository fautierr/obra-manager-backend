import { Resolver, Query } from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { Project } from './entities/project.entity'

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectsService.findAll()
  }
}
