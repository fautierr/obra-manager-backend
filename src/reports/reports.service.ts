import { Injectable } from '@nestjs/common'
import {
  MaterialReportsDTO,
  ProjectReportsDTO,
  ProjectReportsItemDTO,
} from './dto/reports.dto'
import { ReportsRepository } from './reports.repository'
import { ProjectsService } from 'src/projects/projects.service'
import { validatePagination } from 'src/utils/filters/validate-pagination'

@Injectable()
export class ReportsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly reportsRepo: ReportsRepository,
  ) {}
  async findProjectTotals(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<ProjectReportsItemDTO> {
    validatePagination(limit, offset)
    await this.projectsService.ensureExists(projectId)
    const materials = await this.reportsRepo.getMaterialsData(
      projectId,
      limit,
      offset,
    )
    this.validateMaterials(materials, projectId)
    const total = await this.reportsRepo.getProjectTotal(projectId)

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

    const materials1 = await this.reportsRepo.getMaterialsData(
      projectId1,
      limit,
      offset,
    )
    const materials2 = await this.reportsRepo.getMaterialsData(
      projectId2,
      limit,
      offset,
    )
    this.validateMaterials(materials1, projectId1)
    this.validateMaterials(materials2, projectId2)

    const total1 = await this.reportsRepo.getProjectTotal(projectId1)
    const total2 = await this.reportsRepo.getProjectTotal(projectId2)

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
