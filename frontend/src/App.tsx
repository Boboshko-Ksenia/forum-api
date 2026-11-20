import { useGetMeQuery, useGetPostsQuery } from './api/baseApi';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import './App.css';

function App() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  const { data: user} = useGetMeQuery();

  if (isLoading) {
    return <h2>Posts loading</h2>;
  }

  if (isError) {
    return <h2 style={{ color: 'red' }}>Error loading posts from the backend!</h2>;
  }

  return (
    <main>
      <Header title="Forum" description="List of posts" />

      {user ? (
        <p>Ви авторизовані як {user.email}</p>
      ) : (
        <div className="auth-container">
          <LoginForm />
          <RegisterForm />
        </div>
      )}

      {!posts || posts.length === 0 ? (
        <h2>No posts found</h2>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  );
}

export default App;

