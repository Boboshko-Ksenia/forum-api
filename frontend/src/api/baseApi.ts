import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from '../types/post';

interface RegisterResponse {
  id: number;
  email: string;
}
interface RegisterRequest {
  email: string;
  password: string;
}
interface AuthResponse {
  id?: number;
  email?: string;
  token?: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000' 
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({query: () => '/posts'}),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data,
      }) 
    }),
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (data) => ({
        url: '/user/login',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetPostsQuery, useRegisterMutation, useLoginMutation } = baseApi;