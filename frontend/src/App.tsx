import { useGetPostsQuery } from './api/baseApi';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import './App.css';

function App() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  if (isLoading) {
    return <h2>Posts loading</h2>;
  }

  if (isError) {
    return <h2 style={{ color: 'red' }}>Error loading posts from the backend!</h2>;
  }

  return (
    <main>
      <Header 
        title="Forum" 
        description="List of posts" 
      />

      {!posts || posts.length === 0 ? (
        <h2>No posts found</h2>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  );
}

export default App;