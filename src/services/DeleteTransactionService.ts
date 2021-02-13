import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    // Buscar para ver se existe
    const transaction = await transactionRepository.findOne({
      where: {
        id,
      },
    });

    // Caso não exista
    if (!transaction) {
      throw new AppError('Transactions does not exist');
    }

    // Removendo a transação encontrada
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
