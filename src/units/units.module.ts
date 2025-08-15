import { Module } from '@nestjs/common'
import { UnitsService } from './units.service'
import { UnitsResolver } from './units.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Unit } from './entities/unit.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  providers: [UnitsResolver, UnitsService],
})
export class UnitsModule {}
