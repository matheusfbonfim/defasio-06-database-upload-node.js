import { Router, Request, Response } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request: Request, response: Response) => {
  // TODO
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
    // TODO
  },
);

transactionsRouter.post(
  '/import',
  async (request: Request, response: Response) => {
    // TODO
  },
);

export default transactionsRouter;
