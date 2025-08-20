import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class AddCategoryIdToProjectMaterials1692460000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna category_id
    await queryRunner.addColumn(
      'construction.project_materials',
      new TableColumn({
        name: 'category_id',
        type: 'int',
        isNullable: true, // lo dejamos nullable por si ya existen registros
      }),
    )

    // Crear la foreign key
    await queryRunner.createForeignKey(
      'construction.project_materials',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'construction.categories',
        onDelete: 'SET NULL', // si se borra la categoría, seteamos null en project_materials
        onUpdate: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Buscar la FK para poder eliminarla
    const table = await queryRunner.getTable('construction.project_materials')
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    )
    if (foreignKey) {
      await queryRunner.dropForeignKey(
        'construction.project_materials',
        foreignKey,
      )
    }

    // Eliminar la columna category_id
    await queryRunner.dropColumn(
      'construction.project_materials',
      'category_id',
    )
  }
}
