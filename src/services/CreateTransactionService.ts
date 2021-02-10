import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

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
    // Instancia o repositório para o uso - typeorm
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // Instanciar um repositorio a partir da nossa model
    const categoryRepository = getRepository(Category);

    // Recebe o total vindo de getBalance()
    const { total } = await transactionsRepository.getBalance();

    // Se a saida (outcome) for maior que o saldo -> Erro
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    // Verificar se a categoria já existe
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // Não existe? Cria ela
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    // Conectado ao banco de dados pelo repositório
    // Cria um registro (transação)
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // Inserção no banco de dados -> save
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
