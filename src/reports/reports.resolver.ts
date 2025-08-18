// reports.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql'
import { ReportsService } from './reports.service'
import { ProjectComparison, ProjectTotals } from './dto/reports.dto'

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => ProjectTotals, { name: 'findProjectTotals' })
  findProjectTotals(
    @Args('projectId', { type: () => String }) projectId: string,
  ) {
    return this.reportsService.findProjectTotals(projectId)
  }

  @Query(() => ProjectComparison, { name: 'findProjectComparison' })
  findProjectComparison(
    @Args('project1Id', { type: () => String }) project1Id: string,
    @Args('project2Id', { type: () => String }) project2Id: string,
  ) {
    return this.reportsService.findProjectComparison(project1Id, project2Id)
  }
}
