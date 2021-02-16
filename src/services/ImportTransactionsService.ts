import csvParse from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';
import fs from 'fs'; // File system -> Abrir arquivo e ler
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);

    // config de parse
    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // Regra de negócio
    // Utilizado os arrays para inserir tudo de uma vez
    // Método in -> verifica se as categorias (array) existem no banco (de uma vez só)

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    // console.log(categories);

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => {
        return category.title;
      },
    );

    // Adiciona todas que nao estiverem no banco
    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    console.log(addCategoryTitles);
    console.log(existentCategoriesTitles);
    // console.log(transactions);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
