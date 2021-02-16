import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryIdToTransactions1612831720773
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionando campo para depois denominar foreign key
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Inserindo uma chave estrangeira
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        name: 'TransactionCategory',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop na chave estrangeira
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
    // drop a coluna
    await queryRunner.dropColumn('transactions', 'category_id');
  }
}
