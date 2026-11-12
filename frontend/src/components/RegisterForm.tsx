import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../api/baseApi';
interface RegisterFormValues {
    email: string;
    password: string;
}

export function RegisterForm() {
    const { register, handleSubmit, reset } = useForm<RegisterFormValues>();
    const [registerUser] = useRegisterMutation();
    async function onSubmit(data: RegisterFormValues) {
        const result = await registerUser(data);
        if ('data' in result && result.data) {
        alert(`Користувач ${result.data.email || data.email} успішно зареєструвався!`);
        reset(); 
        } else {
        alert('Помилка реєстрації! Перевірте дані або можливо такий email вже існує.');
        }
  }
    return( 
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <h3>Реєстрація</h3>
            <input className="auth-input"
                type='email' 
                placeholder='user@gmail.com' 
                required
                {...register( 'email')}
            />
            <input className="auth-input"
                type='password'
                placeholder='Ваш пароль'
                required
                {...register( 'password')}
            />
            <button className="auth-button" type='submit'>Зареєструватися</button>
        </form>
    )
}