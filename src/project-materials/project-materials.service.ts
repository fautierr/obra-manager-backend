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

  async createMany(
    input: CreateProjectMaterialInput,
  ): Promise<ProjectMaterial[]> {
    const project = await this.projectsRepo.findOne({
      where: { id: input.projectId },
    })
    if (!project) {
      throw new NotFoundException(`Project ${input.projectId} not found`)
    }

    const materialsToSave: ProjectMaterial[] = []

    for (const m of input.materials) {
      const material = await this.materialsRepo.findOne({
        where: { id: m.materialId },
      })
      if (!material) {
        throw new NotFoundException(`Material ${m.materialId} not found`)
      }

      const projectMaterial = this.projectMaterialsRepo.create({
        project,
        material,
        quantity: m.quantity,
        unit_price: m.unitPrice ?? 0,
      })
      materialsToSave.push(projectMaterial)
    }

    return await this.projectMaterialsRepo.save(materialsToSave)
  }

  async updateMany(
    inputs: UpdateProjectMaterialInput[],
  ): Promise<ProjectMaterial[]> {
    const updatedMaterials: ProjectMaterial[] = []

    for (const input of inputs) {
      const projectMaterial = await this.projectMaterialsRepo.findOne({
        where: { id: input.id },
        relations: ['material', 'project'],
      })

      if (!projectMaterial) {
        throw new NotFoundException(`ProjectMaterial ${input.id} not found`)
      }

      if (input.quantity !== undefined) {
        projectMaterial.quantity = input.quantity
      }

      if (input.unitPrice !== undefined) {
        projectMaterial.unit_price = input.unitPrice
      }

      const saved = await this.projectMaterialsRepo.save(projectMaterial)
      updatedMaterials.push(saved)
    }

    return updatedMaterials
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.projectMaterialsRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`ProjectMaterial with id ${id} not found`)
    }

    return true
  }
}
