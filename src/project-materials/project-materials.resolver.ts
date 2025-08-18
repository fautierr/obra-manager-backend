import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql'
import { ProjectMaterialsService } from './project-materials.service'
import { ProjectMaterial } from './entities/project-material.entity'
import { CreateProjectMaterialInput } from './dto/create-project-material.input'
import { UpdateProjectMaterialInput } from './dto/update-project-material.input'

@Resolver(() => ProjectMaterial)
export class ProjectMaterialsResolver {
  constructor(
    private readonly projectMaterialsService: ProjectMaterialsService,
  ) {}

  @Query(() => [ProjectMaterial], { name: 'findMaterialsByProjectId' })
  async findAll(@Args('projectId', { type: () => String }) projectId: string) {
    const projectMaterials =
      await this.projectMaterialsService.findAll(projectId)
    return projectMaterials
  }

  @Mutation(() => ProjectMaterial, { name: 'createProjectMaterial' })
  create(@Args('input') input: CreateProjectMaterialInput) {
    return this.projectMaterialsService.create(input)
  }

  @Mutation(() => ProjectMaterial, { name: 'updateProjectMaterial' })
  async update(
    @Args('input') input: UpdateProjectMaterialInput,
  ): Promise<ProjectMaterial> {
    return this.projectMaterialsService.update(input)
  }

  @Mutation(() => Boolean, { name: 'deleteProjectMaterial' })
  async remove(@Args('projectMaterialId', { type: () => Int }) id: number) {
    return this.projectMaterialsService.remove(id)
  }
}
