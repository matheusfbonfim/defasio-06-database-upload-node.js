import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request: Request, response: Response) => {
  // Apenas retornar sem regra de negócio pré-fixada
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  // find -> Busca todos os registros que puderem serem encontrados
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body;

  // Instanciando o service
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/:id',
  async (request: Request, response: Response) => {
    // Id vindo do request
    const { id } = request.params;

    // Service -> Manipulação direto no banco
    const deleteTransaction = new DeleteTransactionService();

    // Executa o delete e não retorna nada
    await deleteTransaction.execute(id);

    // Retorna o status e uma resposta vazia
    return response.status(204).send();
  },
);

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request: Request, response: Response) => {
    // Instanciando o servico de import
    const importTransactions = new ImportTransactionsService();

    // request.file.path -> Diretorio do arquivo
    const transactions = await importTransactions.execute(request.file.path);
    return response.json(transactions);
  },
);

export default transactionsRouter;
