import {
  Entity, // Indica ser uma entidade do banco de dados
  Column, // Indica ser uma coluna do banco de dados
  PrimaryGeneratedColumn, // Indica ser uma coluna e chave primaria
  ManyToOne, // Relação um muitos para um
  JoinColumn, // Referencia qual coluna ira fazer a relação N..1
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from './Category';

@Entity('transactions') // Referencia uma tabela no banco de dados
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // Por padrão vincula uma coluna de string
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal')
  value: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
