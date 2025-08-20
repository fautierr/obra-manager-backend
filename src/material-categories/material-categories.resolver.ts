import { Resolver, Query, Args, Int } from '@nestjs/graphql'
import { MaterialCategoriesService } from './material-categories.service'
import { MaterialCategory } from './entities/material-category.entity'

@Resolver(() => MaterialCategory)
export class MaterialCategoriesResolver {
  constructor(
    private readonly materialCategoriesService: MaterialCategoriesService,
  ) {}

  @Query(() => [MaterialCategory], { name: 'findAllMaterialCategories' })
  findAll() {
    return this.materialCategoriesService.findAll()
  }

  @Query(() => [MaterialCategory], { name: 'findMaterialCategoriesByFilter' })
  async findByFilter(
    @Args('materialId', { type: () => Int, nullable: true })
    materialId?: number,
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
  ) {
    return this.materialCategoriesService.findByFilter({
      materialId,
      categoryId,
    })
  }
}
