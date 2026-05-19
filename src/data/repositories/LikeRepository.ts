import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { api } from '../../infra/http/api';

export class LikeRepository implements ILikeRepository {
  async toggle(postId: string): Promise<void> {
    await api.post('/likes', { postId });
  }
}
