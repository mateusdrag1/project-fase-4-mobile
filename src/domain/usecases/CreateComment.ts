import { Comment } from '../entities/Comment';
import { ICommentRepository } from '../repositories/ICommentRepository';

export class CreateComment {
  constructor(private readonly commentRepo: ICommentRepository) {}

  async execute(postId: string, content: string): Promise<Comment> {
    return this.commentRepo.create(postId, content);
  }
}
