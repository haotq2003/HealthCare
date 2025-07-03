import axios from 'axios';
import { API_URL } from '../config/apiURL';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const blogService = {
  getAllBlogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Blogs`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await axios.post(`${API_URL}/api/Blogs`, blogData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateBlog: async (blogData) => {
    try {
      const response = await axios.put(`${API_URL}/api/Blogs/${blogData.id}`, blogData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteBlog: async (blogId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/Blogs/${blogId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getBlogById: async (blogId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Blogs/${blogId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
