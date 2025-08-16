import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsDeletedToProjects1680000000000 implements MigrationInterface {
  name = 'AddIsDeletedToProjects1680000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "construction"."projects" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "construction"."projects" DROP COLUMN "is_deleted"`,
    )
  }
}
