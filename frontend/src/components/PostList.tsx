import type { Post } from "../types/post";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: Post[];
}

export function PostList(props: PostListProps) {
  const { posts } = props;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}