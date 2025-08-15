import { Resolver, Query } from '@nestjs/graphql'
import { MaterialsService } from './materials.service'
import { Material } from './entities/material.entity'

@Resolver(() => Material)
export class MaterialsResolver {
  constructor(private readonly materialsService: MaterialsService) {}

  @Query(() => [Material], { name: 'findAllMaterials' })
  async findAll() {
    const materials = await this.materialsService.findAll()
    return materials
  }
}
