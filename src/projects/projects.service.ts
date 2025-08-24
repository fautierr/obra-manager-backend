import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { ProjectsPagination } from './dto/project-pagination.type'
import { CreateProjectInput } from './dto/create-project.input'
import { User } from 'src/users/entities/user.entity'
import { ProjectStatus } from 'src/project-statuses/entities/project-status.entity'
import { UpdateProjectInput } from './dto/update-project.input'

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
      where: { user: { id: userId }, is_deleted: false },
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
  async findById(id: string): Promise<Project> {
    const project = await this.ensureExists(id)

    return project
  }
  async create(input: CreateProjectInput): Promise<Project> {
    const user = await this.usersRepo.findOne({ where: { id: input.userId } })
    if (!user) throw new NotFoundException(`User ${input.userId} not found`)

    const status = await this.projectStatusRepo.findOne({
      where: { id: input.statusId },
    })
    if (!status)
      throw new NotFoundException(`ProjectStatus ${input.statusId} not found`)

    const project = this.projectsRepo.create({
      name: input.name,
      description: input.description,
      user: user,
      status: status,
    })

    return await this.projectsRepo.save(project)
  }
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const project = await this.ensureExists(id)

    if (input.statusId) {
      const status = await this.projectStatusRepo.findOne({
        where: { id: input.statusId },
      })
      if (!status)
        throw new NotFoundException(`ProjectStatus ${input.statusId} not found`)
      project.status = status
    }

    if (input.name !== undefined) project.name = input.name
    if (input.description !== undefined) project.description = input.description

    return await this.projectsRepo.save(project)
  }
  async remove(id: string): Promise<Project> {
    const project = await this.ensureExists(id)

    project.is_deleted = true

    return this.projectsRepo.save(project)
  }

  // Validations

  async ensureExists(id: string): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: { id, is_deleted: false },
    })
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`)
    }
    return project
  }
}
