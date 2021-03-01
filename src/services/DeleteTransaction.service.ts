import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = transactionsRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Transaction does not exist', 404);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
