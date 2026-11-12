import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../api/baseApi';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit, reset } = useForm<LoginFormValues>();
  const [loginUser] = useLoginMutation();

  async function onSubmit(data: LoginFormValues) {
    const result = await loginUser(data);

    if ('data' in result && result.data) {
      alert(`Ви успішно увійшли як ${result.data.email || data.email}!`);
      reset();
    } else {
      alert('Помилка авторизації! Невірний email або пароль.');
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h3>Авторизація</h3>
      <input
        className="auth-input"
        type="email"
        placeholder="user@gmail.com"
        required
        {...register('email')}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Ваш пароль"
        required
        {...register('password')}
      />
      <button className="auth-button" type="submit">Увійти</button>
</form>
  );
}