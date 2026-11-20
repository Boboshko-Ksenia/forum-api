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
  id: number;
  email: string;

}

interface AuthRequest {
  email: string;
  password: string;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000',
    credentials: "include" 
  }),
  tagTypes: ['Me'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({query: () => '/posts'}),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Me']
    }),
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (data) => ({
        url: '/user/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Me']
    }),
    getMe: builder.query<AuthResponse, void>({
            query: () => '/user/me',
            providesTags: ['Me']
  }),
})
})

export const { useGetPostsQuery, useRegisterMutation, useLoginMutation, useGetMeQuery } = baseApi;