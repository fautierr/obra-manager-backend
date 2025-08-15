import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Unit } from './entities/unit.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepo: Repository<Unit>,
  ) {}
  async findAll() {
    const units = await this.unitsRepo.find()
    return units
  }
}
