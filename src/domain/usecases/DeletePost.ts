import { IPostRepository } from '../repositories/IPostRepository';

export class DeletePost {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(id: string): Promise<void> {
    return this.postRepo.remove(id);
  }
}
