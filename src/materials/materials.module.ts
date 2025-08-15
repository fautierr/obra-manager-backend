import { Module } from '@nestjs/common'
import { MaterialsService } from './materials.service'
import { MaterialsResolver } from './materials.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Material } from './entities/material.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [MaterialsResolver, MaterialsService],
})
export class MaterialsModule {}
