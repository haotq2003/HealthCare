import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../../services/BLogService';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Sức Khỏe</h1>
      {loading ? <div>Đang tải...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-48 object-cover rounded mb-3" />
              <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
              <div className="text-gray-500 text-sm mb-2">{new Date(blog.createdTime).toLocaleDateString('vi-VN')}</div>
              <div className="mb-2 text-gray-700">{blog.summary}</div>
              <div className="text-xs text-gray-400 mb-2">Số phần: {blog.contents?.length || 0}</div>
              <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline mt-auto">Xem chi tiết</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;