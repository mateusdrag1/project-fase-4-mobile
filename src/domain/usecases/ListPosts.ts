import { Post } from '../entities/Post';
import { IPostRepository } from '../repositories/IPostRepository';

export class ListPosts {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return this.postRepo.list();
  }
}
