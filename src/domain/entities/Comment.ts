import { User } from './User';

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
}
