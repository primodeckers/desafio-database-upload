import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategory(title: string): Promise<Category> {
    let category = await this.findOne({ where: { title } });

    if (!category) {
      category = this.create({ title });

      await this.save(category);
    }

    return category;
  }
}

export default CategoryRepository;
