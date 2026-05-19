export interface CommentDTO {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  author: { id: string; name: string; email: string };
}

export interface PostDTO {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: string;
  comments: CommentDTO[];
  likesCount: number;
  likedByMe: boolean;
}
