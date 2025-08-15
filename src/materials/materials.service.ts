import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Material } from './entities/material.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepo: Repository<Material>,
  ) {}
  async findAll() {
    const materials = await this.materialsRepo.find()
    return materials
  }
}
