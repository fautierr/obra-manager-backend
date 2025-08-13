import { Resolver, Query, Args, Int } from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { ProjectsPagination } from './dto/project-pagination.type'

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => ProjectsPagination, { name: 'projects' })
  findAll(
    @Args('userId', { type: () => String }) userId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    return this.projectsService.findAll(userId, page, limit)
  }
}
