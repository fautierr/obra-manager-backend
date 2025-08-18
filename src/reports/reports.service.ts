// reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import {
  ProjectTotals,
  ProjectComparison,
  MaterialBreakdown,
} from './dto/reports.dto'
import { ProjectMaterial } from 'src/project-materials/entities/project-material.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ProjectMaterial)
    private projectMaterialsRepo: Repository<ProjectMaterial>,
  ) {}

  // Totales de un proyecto
  async findProjectTotals(projectId: string): Promise<ProjectTotals> {
    const projectMaterials = await this.projectMaterialsRepo.find({
      where: { project: { id: projectId } },
      relations: ['material'],
    })

    if (!projectMaterials.length)
      throw new NotFoundException(`Project ${projectId} has no materials`)

    const totalCostRaw = projectMaterials.reduce(
      (acc, m) => acc + Number(m.quantity) * Number(m.unit_price),
      0,
    )
    const totalCost = Number(totalCostRaw.toFixed(2))

    const materials: MaterialBreakdown[] = projectMaterials.map((m) => {
      const materialTotal = Number(
        (Number(m.quantity) * Number(m.unit_price)).toFixed(2),
      )
      const percentage = totalCost
        ? Number(((materialTotal * 100) / totalCost).toFixed(2))
        : 0
      return {
        materialId: m.material.id,
        materialName: m.material.name,
        quantity: Number(Number(m.quantity).toFixed(2)),
        totalCost: materialTotal,
        percentageOfProject: percentage,
      }
    })

    return {
      projectId,
      totalCost,
      materials,
    }
  }

  // Comparación entre dos proyectos
  async findProjectComparison(
    project1Id: string,
    project2Id: string,
  ): Promise<ProjectComparison> {
    const project1Materials = await this.projectMaterialsRepo.find({
      where: { project: { id: project1Id } },
      relations: ['material'],
    })
    const project2Materials = await this.projectMaterialsRepo.find({
      where: { project: { id: project2Id } },
      relations: ['material'],
    })

    if (!project1Materials.length)
      throw new NotFoundException(`Project ${project1Id} has no materials`)
    if (!project2Materials.length)
      throw new NotFoundException(`Project ${project2Id} has no materials`)

    const calcTotal = (materials: ProjectMaterial[]) =>
      Number(
        materials
          .reduce(
            (acc, m) => acc + Number(m.quantity) * Number(m.unit_price),
            0,
          )
          .toFixed(2),
      )

    const project1Total = calcTotal(project1Materials)
    const project2Total = calcTotal(project2Materials)

    const difference = Number(
      Math.abs(project1Total - project2Total).toFixed(2),
    )
    const differencePercentage = Number(
      ((difference / Math.max(project1Total, project2Total)) * 100).toFixed(2),
    )
    const higherProjectId =
      project1Total > project2Total ? project1Id : project2Id

    const calcBreakdown = (
      materials: ProjectMaterial[],
      total: number,
    ): MaterialBreakdown[] =>
      materials.map((m) => {
        const materialTotal = Number(
          (Number(m.quantity) * Number(m.unit_price)).toFixed(2),
        )
        const percentage = total
          ? Number(((materialTotal * 100) / total).toFixed(2))
          : 0
        return {
          materialId: m.material.id,
          materialName: m.material.name,
          quantity: Number(Number(m.quantity).toFixed(2)),
          totalCost: materialTotal,
          percentageOfProject: percentage,
        }
      })

    return {
      project1Id,
      project1Total,
      project2Id,
      project2Total,
      difference,
      differencePercentage,
      higherProjectId,
      project1Materials: calcBreakdown(project1Materials, project1Total),
      project2Materials: calcBreakdown(project2Materials, project2Total),
    }
  }
}
