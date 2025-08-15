import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectStatus } from './entities/project-status.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProjectStatusesService {
  constructor(
    @InjectRepository(ProjectStatus)
    private projectStatusesRepo: Repository<ProjectStatus>,
  ) {}
  async findAll() {
    const projectStatuses = await this.projectStatusesRepo.find({
      order: { id: 'ASC' },
    })
    return projectStatuses
  }
}
