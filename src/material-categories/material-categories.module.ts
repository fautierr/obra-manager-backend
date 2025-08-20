import { Module } from '@nestjs/common'
import { MaterialCategoriesService } from './material-categories.service'
import { MaterialCategoriesResolver } from './material-categories.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MaterialCategory } from './entities/material-category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MaterialCategory])],
  providers: [MaterialCategoriesResolver, MaterialCategoriesService],
})
export class MaterialCategoriesModule {}
