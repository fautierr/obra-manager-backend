import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectMaterial } from './entities/project-material.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateProjectMaterialInput } from './dto/create-project-material.input'
import { UpdateProjectMaterialInput } from './dto/update-project-material.input'
import { ProjectCategoryProgress } from './dto/project-category-progress.dto'
import { CategoryDetail } from './dto/category-detail.dto'
import { ProjectsService } from 'src/projects/projects.service'
import { MaterialsService } from 'src/materials/materials.service'
import { CategoriesService } from 'src/categories/categories.service'
import { MaterialCategoriesService } from 'src/material-categories/material-categories.service'

@Injectable()
export class ProjectMaterialsService {
  constructor(
    @InjectRepository(ProjectMaterial)
    private projectMaterialsRepo: Repository<ProjectMaterial>,
    private dataSource: DataSource,
    private readonly projectsService: ProjectsService,
    private readonly materialsService: MaterialsService,
    private readonly categoriesService: CategoriesService,
    private readonly materialCategoriesService: MaterialCategoriesService,
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

  async getCategoryProgress(
    projectId: string,
  ): Promise<ProjectCategoryProgress[]> {
    const query = `
    SELECT
      c.id AS "categoryId",
      c.name AS "categoryName"
    FROM construction.categories c
    INNER JOIN construction.material_categories mc
      ON mc.category_id = c.id
    INNER JOIN construction.materials m
      ON m.id = mc.material_id
    INNER JOIN construction.project_materials pm
      ON pm.material_id = m.id
     AND pm.project_id = $1
    GROUP BY c.id, c.name;
  `

    return await this.dataSource.query(query, [projectId])
  }

  async getCategoryDetails(
    projectId: string,
    categoryId: number,
  ): Promise<CategoryDetail[]> {
    const query = `
      SELECT 
        m.name AS "name",
        m.description AS "description",
        pm.quantity,
        pm.unit_price AS "unitPrice",
        jsonb_build_object(
          'id', u.id,
          'name', u.name,
          'abbreviation', u.abbreviation
        ) AS unit
      FROM construction.project_materials pm
      JOIN construction.materials m ON m.id = pm.material_id
      JOIN construction.units u ON u.id = m.unit_id
      WHERE pm.project_id = $1 AND pm.category_id = $2
      `

    return await this.dataSource.query(query, [projectId, categoryId])
  }

  async createMany(
    input: CreateProjectMaterialInput,
  ): Promise<ProjectMaterial[]> {
    const project = await this.projectsService.ensureExists(input.projectId)

    const materialsToSave: ProjectMaterial[] = []

    for (const m of input.materials) {
      const material = await this.materialsService.materialExists(m.materialId)
      const category = await this.categoriesService.categoryExists(m.categoryId)
      // validRelation
      await this.materialCategoriesService.materialCategoryExists(
        m.materialId,
        m.categoryId,
      )

      const projectMaterial = this.projectMaterialsRepo.create({
        project,
        material,
        quantity: m.quantity,
        unit_price: m.unitPrice ?? 0,
        category,
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
      const projectMaterial = await this.projectMaterialExists(input.id)

      this.nothingToUpdateExist(input)

      if (input.quantity !== undefined && input.quantity !== null) {
        projectMaterial.quantity = input.quantity
      }

      if (input.unitPrice !== undefined) {
        projectMaterial.unit_price = input.unitPrice
      }

      if (input.categoryId !== undefined) {
        const category = await this.categoriesService.categoryExists(
          input.categoryId,
        )

        await this.materialCategoriesService.materialCategoryExists(
          projectMaterial.material.id,
          input.categoryId,
        )
        projectMaterial.category = category
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

  // Validations

  async projectMaterialExists(id: number): Promise<ProjectMaterial> {
    const projectMaterial = await this.projectMaterialsRepo.findOne({
      where: { id },
      relations: ['material', 'project'],
    })

    if (!projectMaterial) {
      throw new NotFoundException(`ProjectMaterial ${id} not found`)
    }

    return projectMaterial
  }

  nothingToUpdateExist(input: UpdateProjectMaterialInput): void {
    const nothingToUpdate =
      input.quantity === undefined &&
      input.unitPrice === undefined &&
      input.categoryId === undefined

    if (nothingToUpdate) {
      throw new BadRequestException(
        `ProjectMaterial ${input.id} must include at least one field to update`,
      )
    }
  }
}
