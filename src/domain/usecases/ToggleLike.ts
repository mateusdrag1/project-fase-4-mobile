import { ILikeRepository } from '../repositories/ILikeRepository';

export class ToggleLike {
  constructor(private readonly likeRepo: ILikeRepository) {}

  async execute(postId: string): Promise<void> {
    return this.likeRepo.toggle(postId);
  }
}
