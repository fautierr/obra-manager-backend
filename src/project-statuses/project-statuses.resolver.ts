import { Resolver, Query } from '@nestjs/graphql'
import { ProjectStatusesService } from './project-statuses.service'
import { ProjectStatus } from './entities/project-status.entity'

@Resolver(() => ProjectStatus)
export class ProjectStatusesResolver {
  constructor(
    private readonly projectStatusesService: ProjectStatusesService,
  ) {}

  @Query(() => [ProjectStatus], { name: 'findAllProjectStatuses' })
  async findAll() {
    const projectStatuses = await this.projectStatusesService.findAll()
    return projectStatuses
  }
}
