import { useForm } from 'react-hook-form';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useLoginMutation } from '../api/baseApi';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
  });

  const [loginUser] = useLoginMutation();

  async function onSubmit(data: LoginFormValues) {
    try {
      await loginUser(data).unwrap();
    } catch (error) {
      const apiError = error as FetchBaseQueryError;
      let message = 'Не вдалося увійти. Спробуйте ще раз';

      if (apiError.status === 401) {
        message = 'Неправильний email або пароль';
      } else if (
        apiError.status === 'FETCH_ERROR' ||
        apiError.status === 'TIMEOUT_ERROR'
      ) {
        message = "Не вдалося з'єднатися із сервером";
      }

      setError('root', { message });
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h3>Вхід</h3>

      <input
        className="auth-input"
        type="email"
        placeholder="user@gmail.com"
        {...register('email', {
          required: 'Введіть email',
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        className="auth-input"
        type="password"
        placeholder="Ваш пароль"
        {...register('password', {
          required: 'Введіть пароль',
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      {errors.root && <p>{errors.root.message}</p>}

      <button className="auth-button" type="submit">
        Увійти
      </button>
    </form>
  );
}