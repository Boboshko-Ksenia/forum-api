import type { Post } from "../types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard(props: PostCardProps) {
  const { name, content, category, author } = props.post;

  return (
    <div className="post-card">
      <h3>{name}</h3>
      <p>{content}</p>
      {category && <p>Category: {category.name}</p>}
      {author && <p>Author: {author.email}</p>}
    </div>
  );
}