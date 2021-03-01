/* eslint-disable no-param-reassign */
import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CategoryRepository from './CategoryRepository';
import TransactionDTO from '../util/TransactionDTO';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

/**
 * balance = numberIncome - numberOutcome;
 */

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = { income: 0, outcome: 0, total: 0 };

    const result = transactions.reduce(
      (previousBalance, { value, type }) => {
        if (type === 'income') {
          previousBalance.income += value;
        } else {
          previousBalance.outcome += value;
        }
        previousBalance.total =
          previousBalance.income - previousBalance.outcome;
        return previousBalance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    Object.assign(balance, result);

    return balance;
  }

  public async createTransaction({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const categoriesRepository = getCustomRepository(CategoryRepository);

    const getedCategory = await categoriesRepository.getCategory(category);

    const transaction = this.create({
      title,
      type,
      value,
      category: getedCategory,
    });

    return transaction;
  }
}

export default TransactionsRepository;
