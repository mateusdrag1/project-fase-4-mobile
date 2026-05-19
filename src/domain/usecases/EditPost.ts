import { Post } from '../entities/Post';
import { IPostRepository, UpdatePostInput } from '../repositories/IPostRepository';

export class EditPost {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(id: string, input: UpdatePostInput): Promise<Post> {
    return this.postRepo.update(id, input);
  }
}
