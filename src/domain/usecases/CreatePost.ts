import { Post } from '../entities/Post';
import { IPostRepository, CreatePostInput } from '../repositories/IPostRepository';

export class CreatePost {
  constructor(private readonly postRepo: IPostRepository) {}

  async execute(input: CreatePostInput): Promise<Post> {
    return this.postRepo.create(input);
  }
}
