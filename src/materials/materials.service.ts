import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Material } from './entities/material.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepo: Repository<Material>,
  ) {}
  async findAll(): Promise<Material[]> {
    const materials = await this.materialsRepo.find()
    return materials
  }

  async findById(id: number): Promise<Material> {
    const material = await this.materialsRepo.findOne({
      where: { id },
    })

    if (!material) {
      throw new NotFoundException(`Material ${id} not found`)
    }

    return material
  }
}
