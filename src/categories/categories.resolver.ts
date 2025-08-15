import { Resolver, Query } from '@nestjs/graphql'
import { CategoriesService } from './categories.service'
import { Category } from './entities/category.entity'

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'findAllCategories' })
  findAll() {
    return this.categoriesService.findAll()
  }
}
