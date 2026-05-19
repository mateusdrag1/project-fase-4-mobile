import { Post } from '../entities/Post';
import { IPostRepository } from '../repositories/IPostRepository';

export class SearchPosts {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(query: string): Promise<Post[]> {
    return this.postRepo.search(query);
  }
}
