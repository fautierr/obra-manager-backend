import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { ProjectsPagination } from './dto/project-pagination.type'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ProjectsPagination> {
    const [data, total] = await this.projectsRepo.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    })
    if (data.length === 0) {
      throw new NotFoundException(`No projects found for user ${userId}`)
    }
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }
}
