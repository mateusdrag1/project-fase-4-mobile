import { Comment } from './Comment';

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  published: boolean;
  comments: Comment[];
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
}
