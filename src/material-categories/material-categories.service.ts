import { BadRequestException, Injectable } from '@nestjs/common'
import { MaterialCategory } from './entities/material-category.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class MaterialCategoriesService {
  constructor(
    @InjectRepository(MaterialCategory)
    private materialCategoriesRepo: Repository<MaterialCategory>,
  ) {}
  async findAll(): Promise<MaterialCategory[]> {
    const materialCategories = await this.materialCategoriesRepo.find({})
    return materialCategories
  }

  async findByFilter(params: {
    materialId?: number
    categoryId?: number
  }): Promise<MaterialCategory[]> {
    const { materialId, categoryId } = params

    if ((materialId && categoryId) || (!materialId && !categoryId)) {
      throw new BadRequestException(
        'You must pass only materialId or categoryId, but not both or either.',
      )
    }

    const query = this.materialCategoriesRepo
      .createQueryBuilder('mc')
      .leftJoinAndSelect('mc.material', 'material')
      .leftJoinAndSelect('mc.category', 'category')

    if (materialId) {
      query.where('mc.material_id = :materialId', { materialId })
    } else if (categoryId) {
      query.where('mc.category_id = :categoryId', { categoryId })
    }

    return query.getMany()
  }

  // Validations

  async materialCategoryExists(
    materialId: number,
    categoryId: number,
  ): Promise<void> {
    const validRelation = await this.materialCategoriesRepo.findOne({
      where: {
        material: { id: materialId },
        category: { id: categoryId },
      },
    })

    if (!validRelation) {
      throw new BadRequestException(
        `Material ${materialId} does not belong to category ${categoryId}`,
      )
    }
  }
}
