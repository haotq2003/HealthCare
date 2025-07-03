import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../../services/BLogService';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy blog</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/blog" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{blog.title}</h1>
      <h2 className="text-lg text-gray-600 mb-2">{blog.headline}</h2>
      <div className="text-gray-500 text-sm mb-2">{new Date(blog.createdTime).toLocaleDateString('vi-VN')}</div>
      <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-64 object-cover rounded mb-4" />
      <div className="mb-4 text-gray-700">{blog.summary}</div>
      <div className="space-y-6">
        {blog.contents && blog.contents.map((section, idx) => (
          <div key={idx} className="bg-gray-50 rounded p-4">
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <div className="text-gray-800 whitespace-pre-line">{section.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailPage;
