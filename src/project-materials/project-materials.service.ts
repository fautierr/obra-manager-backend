import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectMaterial } from './entities/project-material.entity'
import { Repository } from 'typeorm'
import { CreateProjectMaterialInput } from './dto/create-project-material.input'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'
import { UpdateProjectMaterialInput } from './dto/update-project-material.input'

@Injectable()
export class ProjectMaterialsService {
  constructor(
    @InjectRepository(ProjectMaterial)
    private projectMaterialsRepo: Repository<ProjectMaterial>,
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
    @InjectRepository(Material)
    private materialsRepo: Repository<Material>,
  ) {}
  async findAll(projectId: string): Promise<ProjectMaterial[]> {
    const projectMaterials = await this.projectMaterialsRepo.find({
      where: { project: { id: projectId } },
      relations: ['material', 'project'],
    })
    if (projectMaterials.length === 0) {
      throw new NotFoundException(`No materials found for  ${projectId}`)
    }
    return projectMaterials
  }

  async create(input: CreateProjectMaterialInput): Promise<ProjectMaterial> {
    const project = await this.projectsRepo.findOne({
      where: { id: input.projectId },
    })
    if (!project)
      throw new NotFoundException(
        `Project material ${input.projectId} not found`,
      )
    const material = await this.materialsRepo.findOne({
      where: { id: input.materialId },
    })
    if (!material)
      throw new NotFoundException(`Material ${input.materialId} not found`)
    const projectMaterial = this.projectMaterialsRepo.create({
      project: project, // la entidad completa
      material,
      quantity: input.quantity,
      unit_price: input.unitPrice, // camelCase
    })

    return await this.projectMaterialsRepo.save(projectMaterial)
  }

  async update(input: UpdateProjectMaterialInput): Promise<ProjectMaterial> {
    const projectMaterial = await this.projectMaterialsRepo.findOne({
      where: { id: input.id },
      relations: ['material', 'project'],
    })

    if (!projectMaterial) {
      throw new NotFoundException(`ProjectMaterial ${input.id} not found`)
    }

    // merge solo las propiedades que se envíen
    Object.assign(projectMaterial, {
      quantity: input.quantity ?? projectMaterial.quantity,
      unit_price: input.unitPrice ?? projectMaterial.unit_price,
    })

    return await this.projectMaterialsRepo.save(projectMaterial)
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.projectMaterialsRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`ProjectMaterial with id ${id} not found`)
    }

    return true
  }
}
