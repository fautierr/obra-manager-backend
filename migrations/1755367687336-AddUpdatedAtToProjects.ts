import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUpdatedAtToProjects1713200000000 implements MigrationInterface {
  name = 'AddUpdatedAtToProjects1713200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE construction.projects
      ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE construction.projects
      DROP COLUMN updated_at
    `)
  }
}
