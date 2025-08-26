import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectMaterial } from './entities/project-material.entity'
import { Repository } from 'typeorm'

type CategoryDetailRow = {
  name: string
  description: string
  quantity: string | number
  unitPrice: string | number
  unit_id: number
  unit_name: string
  unit_abbreviation: string
}
type ProjectCategoryProgress = {
  categoryId: number
  categoryName: string
}
@Injectable()
export class ProjectMaterialsRepository {
  constructor(
    @InjectRepository(ProjectMaterial)
    private readonly projectMaterialsRepo: Repository<ProjectMaterial>,
  ) {}
  async findCategoryProgress(
    projectId: string,
  ): Promise<ProjectCategoryProgress[]> {
    const categoriesInUse = this.projectMaterialsRepo
      .createQueryBuilder('pm')
      .select(['c.id AS "categoryId"', 'c.name AS "categoryName"'])
      .innerJoin('pm.category', 'c')
      .where('pm.project_id = :projectId', { projectId })
      .groupBy('c.id')
      .addGroupBy('c.name')
      .getRawMany<ProjectCategoryProgress>()

    return categoriesInUse
  }
  async findCategoryDetails(
    projectId: string,
    categoryId: number,
  ): Promise<CategoryDetailRow[]> {
    const materialsByCategory = this.projectMaterialsRepo
      .createQueryBuilder('pm')
      .select([
        'm.name AS name',
        'm.description AS description',
        'pm.quantity AS quantity',
        'pm.unit_price AS "unitPrice"',
        'u.id AS unit_id',
        'u.name AS unit_name',
        'u.abbreviation AS unit_abbreviation',
      ])
      .innerJoin('pm.material', 'm')
      .innerJoin('m.unit', 'u')
      .where('pm.project_id = :projectId', { projectId })
      .andWhere('pm.category_id = :categoryId', { categoryId })
      .getRawMany<CategoryDetailRow>()

    return materialsByCategory
  }
}
