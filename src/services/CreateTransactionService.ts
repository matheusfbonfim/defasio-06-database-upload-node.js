// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

// Conectando com o banco de dados pelo typeorm

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // Instancia o repositório para o uso
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
    });

    // Inserção no banco de dados
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
