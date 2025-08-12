import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectsRepo.find()
  }
}
