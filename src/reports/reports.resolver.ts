import { Resolver, Query, Args } from '@nestjs/graphql'
import { ReportsService } from './reports.service'
import { ProjectReportsDTO, ProjectReportsItemDTO } from './dto/reports.dto'
import { getPaginationParams } from 'src/utils/filters/validate-pagination'

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => ProjectReportsItemDTO, { name: 'findProjectTotals' })
  findProjectTotals(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ) {
    const { limit: safeLimit, offset: safeOffset } = getPaginationParams({
      limit,
      offset,
    })
    return this.reportsService.findProjectTotals(
      projectId,
      safeLimit,
      safeOffset,
    )
  }

  @Query(() => ProjectReportsDTO, { name: 'findProjectComparison' })
  findProjectComparison(
    @Args('project1Id', { type: () => String }) project1Id: string,
    @Args('project2Id', { type: () => String }) project2Id: string,
    @Args('limit', { type: () => Number, nullable: true }) limit: number,
    @Args('offset', { type: () => Number, nullable: true }) offset: number,
  ) {
    const { limit: safeLimit, offset: safeOffset } = getPaginationParams({
      limit,
      offset,
    })
    return this.reportsService.findProjectsComparison(
      project1Id,
      project2Id,
      safeLimit,
      safeOffset,
    )
  }
}
