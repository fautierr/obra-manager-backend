import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { ProjectsPagination } from './dto/project-pagination.type'
import { CreateProjectInput } from './dto/create-project.input'
import { Project } from './entities/project.entity'

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => ProjectsPagination, { name: 'findProjectsByUserId' })
  findAll(
    @Args('userId', { type: () => String }) userId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    return this.projectsService.findAll(userId, page, limit)
  }

  @Mutation(() => Project, { name: 'createProject' })
  create(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input)
  }
}
