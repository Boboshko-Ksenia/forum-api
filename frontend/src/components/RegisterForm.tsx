import { useForm } from 'react-hook-form';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRegisterMutation } from '../api/baseApi';

interface RegisterFormValues {
  email: string;
  password: string;
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: 'onChange',
  });

  const [registerUser] = useRegisterMutation();

  async function onSubmit(data: RegisterFormValues) {
    try {
      const result = await registerUser(data).unwrap();
      alert(`Користувач ${result.email || data.email} успішно зареєструвався!`);
      reset();
    } catch (error) {
      const apiError = error as FetchBaseQueryError;
      let message = 'Помилка реєстрації! Перевірте дані або можливо такий email вже існує.';

      if (apiError.status === 409) {
        message = 'Цей email вже зайнятий';
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
      <h3>Реєстрація</h3>

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
        Зареєструватися
      </button>
    </form>
  );
}