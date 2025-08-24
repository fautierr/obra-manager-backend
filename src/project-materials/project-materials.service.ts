import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectMaterial } from './entities/project-material.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateProjectMaterialInput } from './dto/create-project-material.input'
import { Project } from 'src/projects/entities/project.entity'
import { Material } from 'src/materials/entities/material.entity'
import { UpdateProjectMaterialInput } from './dto/update-project-material.input'
import { Category } from 'src/categories/entities/category.entity'
import { MaterialCategory } from 'src/material-categories/entities/material-category.entity'
import { ProjectCategoryProgress } from './dto/project-category-progress.dto'
import { CategoryDetail } from './dto/category-detail.dto'

@Injectable()
export class ProjectMaterialsService {
  constructor(
    @InjectRepository(ProjectMaterial)
    private projectMaterialsRepo: Repository<ProjectMaterial>,
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
    @InjectRepository(Material)
    private materialsRepo: Repository<Material>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
    @InjectRepository(MaterialCategory)
    private materialCategoriesRepo: Repository<MaterialCategory>,
    private dataSource: DataSource,
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

      const category = await this.categoriesRepo.findOne({
        where: { id: m.categoryId },
      })
      if (!category)
        throw new NotFoundException(`Category ${m.categoryId} not found`)

      const validRelation = await this.materialCategoriesRepo.findOne({
        where: {
          material: { id: m.materialId },
          category: { id: m.categoryId },
        },
      })

      if (!validRelation) {
        throw new BadRequestException(
          `Material ${m.materialId} does not belong to category ${m.categoryId}`,
        )
      }

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

      if (input.categoryId !== undefined) {
        const category = await this.categoriesRepo.findOne({
          where: { id: input.categoryId },
        })
        if (!category) {
          throw new NotFoundException(`Category ${input.categoryId} not found`)
        }

        const validRelation = await this.materialCategoriesRepo.findOne({
          where: {
            material: { id: projectMaterial.material.id },
            category: { id: input.categoryId },
          },
        })

        if (!validRelation) {
          throw new BadRequestException(
            `Material ${projectMaterial.material.id} does not belong to category ${input.categoryId}`,
          )
        }
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
}
