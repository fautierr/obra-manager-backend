import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { ProjectsPagination } from './dto/project-pagination.type'
import { CreateProjectInput } from './dto/create-project.input'
import { User } from 'src/users/entities/user.entity'
import { ProjectStatus } from 'src/project-statuses/entities/project-status.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(ProjectStatus)
    private projectStatusRepo: Repository<ProjectStatus>,
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

  async create(input: CreateProjectInput): Promise<Project> {
    // Traer el usuario desde la DB
    const user = await this.usersRepo.findOne({ where: { id: input.userId } })
    if (!user) throw new NotFoundException(`User ${input.userId} not found`)

    // Traer el status si se pasó statusId

    const status = await this.projectStatusRepo.findOne({
      where: { id: input.statusId },
    })
    if (!status)
      throw new NotFoundException(`ProjectStatus ${input.statusId} not found`)

    // Crear proyecto con relaciones completas
    const project = this.projectsRepo.create({
      name: input.name,
      description: input.description,
      user: user,
      status: status,
    })

    return await this.projectsRepo.save(project)
  }
}
