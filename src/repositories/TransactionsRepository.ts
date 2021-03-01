import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const reducer = (prev: number, curr: number): number => prev + curr;

    const incomeList = await this.find({ where: { type: 'income' } });
    const outcomeList = await this.find({ where: { type: 'outcome' } });

    const income = incomeList
      .map(transaction => transaction.value)
      .reduce(reducer, 0);
    const outcome = outcomeList
      .map(transaction => transaction.value)
      .reduce(reducer, 0);

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
