import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeCategoryIdNotNull1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE construction.project_materials
      ALTER COLUMN category_id SET NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE construction.project_materials
      ALTER COLUMN category_id DROP NOT NULL
    `)
  }
}
