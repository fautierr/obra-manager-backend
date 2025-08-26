import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'
import { Repository } from 'typeorm'
import { MaterialReportsRow } from './types/reports.types'

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(ProjectMaterial)
    private readonly projectMaterialsRepo: Repository<ProjectMaterial>,
  ) {}

  async getProjectTotal(projectId: string): Promise<{ total: string }> {
    const total = await this.projectMaterialsRepo
      .createQueryBuilder('pm')
      .select('SUM(pm.quantity * pm.unit_price)', 'total')
      .where('pm.project_id = :projectId', { projectId })
      .getRawOne<{ total: string }>()

    return total || { total: '0.00' }
  }

  async getMaterialsData(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<MaterialReportsRow[]> {
    return this.projectMaterialsRepo
      .createQueryBuilder('pm')
      .select('m.id', 'id')
      .addSelect('m.name', 'name')
      .addSelect('ROUND(SUM(pm.quantity),2)', 'quantity')
      .addSelect('ROUND(SUM(pm.quantity * pm.unit_price),2)', 'total')
      .addSelect(
        'ROUND((SUM(pm.quantity * pm.unit_price) / SUM(SUM(pm.quantity * pm.unit_price)) OVER()) * 100, 2)',
        'percentage',
      )
      .innerJoin('pm.material', 'm')
      .where('pm.project_id = :projectId', { projectId })
      .groupBy('m.id')
      .addGroupBy('m.name')
      .limit(limit)
      .offset(offset)
      .getRawMany<MaterialReportsRow>()
  }
}
