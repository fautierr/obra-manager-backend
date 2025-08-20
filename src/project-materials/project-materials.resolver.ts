import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql'
import { ProjectMaterialsService } from './project-materials.service'
import { ProjectMaterial } from './entities/project-material.entity'
import { CreateProjectMaterialInput } from './dto/create-project-material.input'
import { UpdateManyProjectMaterialsInput } from './dto/update-project-material.input'
import { ProjectCategoryProgress } from './dto/project-category-progress.dto'
// import { ProjectCategoryProgress } from './dto/project-category-progress.dto'

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

  @Query(() => [ProjectCategoryProgress], {
    name: 'findProjectCategoryProgress',
  })
  async findProjectCategoryProgress(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectCategoryProgress[]> {
    return this.projectMaterialsService.getCategoryProgress(projectId)
  }

  @Mutation(() => [ProjectMaterial], { name: 'createProjectMaterials' })
  create(@Args('input') input: CreateProjectMaterialInput) {
    return this.projectMaterialsService.createMany(input)
  }

  @Mutation(() => [ProjectMaterial], { name: 'updateProjectMaterials' })
  async updateMany(
    @Args('input') input: UpdateManyProjectMaterialsInput,
  ): Promise<ProjectMaterial[]> {
    return this.projectMaterialsService.updateMany(input.materials)
  }

  @Mutation(() => Boolean, { name: 'deleteProjectMaterial' })
  async remove(@Args('projectMaterialId', { type: () => Int }) id: number) {
    return this.projectMaterialsService.remove(id)
  }
}
