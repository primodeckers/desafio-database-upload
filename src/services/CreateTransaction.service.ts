import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import TransactionDTO from '../util/TransactionDTO';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(
        'Type must be a valid value to type: income or outcome',
        400,
      );
    }
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const result = (await transactionsRepository.getBalance()).total;

    if (type === 'outcome' && value > result) {
      throw new AppError(
        'The outcome operation must not exceed your balance.',
        400,
      );
    }

    const transaction = await transactionsRepository.createTransaction({
      title,
      type,
      value,
      category,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
