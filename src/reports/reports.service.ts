import { Injectable, NotFoundException } from '@nestjs/common'
import { ProjectReportsDTO, ProjectReportsItemDTO } from './dto/reports.dto'
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

    const total = await this.reportsRepo.getProjectTotal(projectId)
    this.validateTotal(total)
    const materials = await this.reportsRepo.getMaterialsData(
      projectId,
      limit,
      offset,
    )

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

    const total1 = await this.reportsRepo.getProjectTotal(projectId1)
    const total2 = await this.reportsRepo.getProjectTotal(projectId2)
    this.validateTotal(total1)
    this.validateTotal(total2)

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
    console.log(total1, total2)
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

  validateTotal(total: number): void {
    if (!total) {
      throw new NotFoundException(
        `The total could not be calculated from ${total}`,
      )
    }
  }
}
