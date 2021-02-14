import csvParse from 'csv-parse';

import fs from 'fs'; // File system -> Abrir arquivo e ler
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);

    // config de parse
    const parses = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parses);

    const transactions = [];
    const categories = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    console.log(categories);
    console.log(transactions);
  }
}

export default ImportTransactionsService;
