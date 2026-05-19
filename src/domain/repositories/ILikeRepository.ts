export interface ILikeRepository {
  toggle(postId: string): Promise<void>;
}
