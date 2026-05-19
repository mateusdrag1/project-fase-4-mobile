import { Post } from '../../domain/entities/Post';
import { Comment } from '../../domain/entities/Comment';
import { PostDTO, CommentDTO } from '../dtos/PostDTO';

function mapComment(dto: CommentDTO): Comment {
  return {
    id: dto.id,
    content: dto.content,
    postId: dto.postId,
    createdAt: dto.createdAt,
    author: dto.author,
  };
}

export function mapPost(dto: PostDTO): Post {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    content: dto.content,
    author: dto.author ?? '',
    category: dto.category ?? '',
    published: dto.published ?? true,
    createdAt: dto.createdAt,
    comments: (dto.comments ?? []).map(mapComment),
    likesCount: dto.likesCount ?? 0,
    likedByMe: dto.likedByMe ?? false,
  };
}
