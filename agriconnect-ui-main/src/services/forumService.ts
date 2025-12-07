// services/forumService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreatePostData {
  title: string;
  description: string;
  category: string;
  image?: string;
  images?: string[];
  tags?: string[];
  crops?: string[];
}

export interface ForumPost {
  _id: string;
  author: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    location?: string;
    avatar?: string;
  };
  title: string;
  content: string;
  description: string;
  category: string;
  image?: string;
  images?: string[];
  isAnswered: boolean;
  answer?: {
    content: string;
    expert: {
      _id: string;
      name: string;
      email?: string;
      phone?: string;
      role: string;
      location?: string;
      avatar?: string;
    };
    answeredAt: string;
  };
  upvotes: any[];
  downvotes: any[];
  tags?: string[];
  crops?: string[];
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: ForumPost[];
}

/**
 * Create a new forum post
 */
export const createPost = async (postData: CreatePostData): Promise<ForumPost> => {
  const response = await api.post<{ success: boolean; data: ForumPost }>('/api/forum', postData);
  return response.data.data;
};

/**
 * Get all forum posts
 */
export const getAllPosts = async (params?: {
  category?: string;
  search?: string;
  isAnswered?: boolean;
  author?: string;
  page?: number;
  limit?: number;
}): Promise<ForumPostsResponse> => {
  const response = await api.get<ForumPostsResponse>('/api/forum', { params });
  return response.data;
};

/**
 * Get single post by ID
 */
export const getPostById = async (id: string): Promise<ForumPost> => {
  const response = await api.get<{ success: boolean; data: ForumPost }>(`/api/forum/${id}`);
  return response.data.data;
};

/**
 * Get posts by user ID
 */
export const getPostsByUser = async (userId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<ForumPostsResponse> => {
  const response = await api.get<ForumPostsResponse>(`/api/forum/user/${userId}`, { params });
  return response.data;
};

/**
 * Get current user's posts
 */
export const getMyPosts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ForumPostsResponse> => {
  const response = await api.get<ForumPostsResponse>('/api/forum/my-posts', { params });
  return response.data;
};

/**
 * Update post (e.g., mark as answered)
 */
export const updatePost = async (id: string, data: { isAnswered?: boolean }): Promise<ForumPost> => {
  const response = await api.put<{ success: boolean; data: ForumPost }>(`/api/forum/${id}`, data);
  return response.data.data;
};

/**
 * Delete post
 */
export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/api/forum/${id}`);
};

/**
 * Answer a question (expert only)
 */
export const answerQuestion = async (id: string, answer: string): Promise<ForumPost> => {
  const response = await api.post<{ success: boolean; data: ForumPost }>(`/api/forum/${id}/answer`, {
    answer
  });
  return response.data.data;
};

