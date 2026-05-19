import { Post } from '../entities/Post';
import { IPostRepository } from '../repositories/IPostRepository';

export class ReadPost {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(id: string): Promise<Post> {
    return this.postRepo.getById(id);
  }
}
