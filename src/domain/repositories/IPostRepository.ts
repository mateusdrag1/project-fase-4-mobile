import { Post } from '../entities/Post';

export interface CreatePostInput {
  title: string;
  author: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
}

export interface UpdatePostInput {
  title: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
}

export interface IPostRepository {
  list(): Promise<Post[]>;
  search(query: string): Promise<Post[]>;
  getById(id: string): Promise<Post>;
  create(input: CreatePostInput): Promise<Post>;
  update(id: string, input: UpdatePostInput): Promise<Post>;
  remove(id: string): Promise<void>;
}
