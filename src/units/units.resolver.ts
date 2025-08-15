import { Resolver, Query } from '@nestjs/graphql'
import { UnitsService } from './units.service'
import { Unit } from './entities/unit.entity'

@Resolver(() => Unit)
export class UnitsResolver {
  constructor(private readonly unitsService: UnitsService) {}

  @Query(() => [Unit], { name: 'findAllUnits' })
  async findAll() {
    const units = await this.unitsService.findAll()
    return units
  }
}
