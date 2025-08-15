import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}
  async findAll(): Promise<Category[]> {
    const categories = await this.categoriesRepo.find({
      order: { id: 'ASC' },
    })
    return categories
  }
}
