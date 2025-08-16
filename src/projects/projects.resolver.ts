import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { ProjectsPagination } from './dto/project-pagination.type'
import { CreateProjectInput } from './dto/create-project.input'
import { Project } from './entities/project.entity'
import { UpdateProjectInput } from './dto/update-project.input'

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

  @Query(() => Project, { name: 'findProjectById' })
  findById(@Args('projectId', { type: () => String }) id: string) {
    return this.projectsService.findById(id)
  }

  @Mutation(() => Project, { name: 'createProject' })
  create(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input)
  }

  @Mutation(() => Project, { name: 'updateProject' })
  update(
    @Args('projectId', { type: () => String }) id: string,
    @Args('input') input: UpdateProjectInput,
  ) {
    return this.projectsService.update(id, input)
  }

  @Mutation(() => Project, { name: 'deleteProject' })
  delete(@Args('projectId', { type: () => String }) projectId: string) {
    return this.projectsService.remove(projectId)
  }
}
