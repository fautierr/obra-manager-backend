import { Injectable } from '@nestjs/common'
import {
  MaterialReportsDTO,
  ProjectReportsDTO,
  ProjectReportsItemDTO,
} from './dto/reports.dto'
import { ReportsRepository } from './reports.repository'
import { ProjectsService } from 'src/projects/projects.service'
import { validatePagination } from 'src/utils/filters/validate-pagination'
import { MaterialReportsRow } from './types/reports.types'

@Injectable()
export class ReportsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly reportsRepo: ReportsRepository,
  ) {}

  private mapMaterialRows(rows: MaterialReportsRow[]) {
    return rows.map((r) => ({
      name: r.name,
      quantity: parseFloat(r.quantity),
      total: parseFloat(r.total),
      percentage: parseFloat(r.percentage),
    }))
  }
  async findProjectTotals(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<ProjectReportsItemDTO> {
    validatePagination(limit, offset)
    await this.projectsService.ensureExists(projectId)
    const rows = await this.reportsRepo.getMaterialsData(
      projectId,
      limit,
      offset,
    )
    const materials = this.mapMaterialRows(rows)

    const totalRaw = await this.reportsRepo.getProjectTotal(projectId)
    const total = parseFloat(totalRaw.total || '0')

    return { projectId, total, materials }
  }

  async findProjectsComparison(
    projectId1: string,
    projectId2: string,
    limit: number,
    offset: number,
  ): Promise<ProjectReportsDTO> {
    validatePagination(limit, offset)
    await this.projectsService.ensureExists(projectId1)
    await this.projectsService.ensureExists(projectId2)

    const rows1 = await this.reportsRepo.getMaterialsData(
      projectId1,
      limit,
      offset,
    )
    const rows2 = await this.reportsRepo.getMaterialsData(
      projectId2,
      limit,
      offset,
    )

    const materials1 = this.mapMaterialRows(rows1)
    const materials2 = this.mapMaterialRows(rows2)

    const total1 = parseFloat(
      (await this.reportsRepo.getProjectTotal(projectId1)).total || '0',
    )
    const total2 = parseFloat(
      (await this.reportsRepo.getProjectTotal(projectId2)).total || '0',
    )

    const differencePercentage = parseFloat(
      ((Math.abs(total1 - total2) / Math.max(total1, total2)) * 100).toFixed(2),
    )

    return {
      project1: { projectId: projectId1, total: total1, materials: materials1 },
      project2: { projectId: projectId2, total: total2, materials: materials2 },
      differencePercentage,
    }
  }

  // Validations

  validateMaterials(
    materials: MaterialReportsDTO[],
    projectId: string,
  ): { projectId: string; total: number; materials: MaterialReportsDTO[] } {
    if (materials.length === 0) {
      return { projectId, total: 0, materials: [] }
    }
    const total = materials.reduce((acc, m) => acc + m.total, 0)

    return { projectId, total, materials }
  }
}
