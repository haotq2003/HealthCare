import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const postsPerPage = 6;

  // Sample blog data
  const [blogPosts] = useState([
    {
      id: 1,
      title: 'Hiểu về các bệnh lây truyền qua đường tình dục phổ biến',
      excerpt: 'Tìm hiểu về các loại STI phổ biến, triệu chứng và cách phòng ngừa hiệu quả để bảo vệ sức khỏe của bạn.',
      content: 'Nội dung chi tiết về STI...',
      author: 'BS. Nguyễn Văn An',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-15',
      readTime: '5 phút đọc',
      category: 'STI',
      tags: ['STI', 'Phòng ngừa', 'Sức khỏe'],
      image: 'https://via.placeholder.com/400x250',
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'Tầm quan trọng của việc xét nghiệm định kỳ',
      excerpt: 'Xét nghiệm định kỳ là chìa khóa để phát hiện sớm và điều trị kịp thời các vấn đề sức khỏe sinh sản.',
      content: 'Nội dung chi tiết về xét nghiệm...',
      author: 'BS. Trần Thị Bình',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-12',
      readTime: '7 phút đọc',
      category: 'Xét nghiệm',
      tags: ['Xét nghiệm', 'Sức khỏe', 'Phòng ngừa'],
      image: 'https://via.placeholder.com/400x250',
      views: 980,
      likes: 67
    },
    {
      id: 3,
      title: 'Cách duy trì sức khỏe sinh sản tốt',
      excerpt: 'Những thói quen hàng ngày đơn giản nhưng hiệu quả để duy trì sức khỏe sinh sản tối ưu.',
      content: 'Nội dung chi tiết về sức khỏe sinh sản...',
      author: 'BS. Lê Minh Châu',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-10',
      readTime: '6 phút đọc',
      category: 'Sức khỏe sinh sản',
      tags: ['Sức khỏe', 'Lối sống', 'Dinh dưỡng'],
      image: 'https://via.placeholder.com/400x250',
      views: 1450,
      likes: 112
    },
    {
      id: 4,
      title: 'Tư vấn tâm lý trong chăm sóc sức khỏe giới tính',
      excerpt: 'Vai trò quan trọng của tư vấn tâm lý trong việc giải quyết các vấn đề về sức khỏe giới tính.',
      content: 'Nội dung chi tiết về tư vấn tâm lý...',
      author: 'ThS. Phạm Thị Dung',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-08',
      readTime: '8 phút đọc',
      category: 'Tâm lý',
      tags: ['Tâm lý', 'Tư vấn', 'Sức khỏe tinh thần'],
      image: 'https://via.placeholder.com/400x250',
      views: 756,
      likes: 45
    },
    {
      id: 5,
      title: 'Kế hoạch hóa gia đình hiện đại',
      excerpt: 'Các phương pháp kế hoạch hóa gia đình hiện đại và an toàn cho các cặp đôi.',
      content: 'Nội dung chi tiết về kế hoạch hóa gia đình...',
      author: 'BS. Hoàng Văn Đức',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-05',
      readTime: '10 phút đọc',
      category: 'Kế hoạch hóa gia đình',
      tags: ['Kế hoạch hóa gia đình', 'Tránh thai', 'Gia đình'],
      image: 'https://via.placeholder.com/400x250',
      views: 2100,
      likes: 156
    },
    {
      id: 6,
      title: 'Dinh dưỡng và sức khỏe sinh sản',
      excerpt: 'Tác động của chế độ dinh dưỡng đến sức khỏe sinh sản và khả năng sinh sản.',
      content: 'Nội dung chi tiết về dinh dưỡng...',
      author: 'BS. Nguyễn Thị Hoa',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-03',
      readTime: '6 phút đọc',
      category: 'Dinh dưỡng',
      tags: ['Dinh dưỡng', 'Sức khỏe', 'Sinh sản'],
      image: 'https://via.placeholder.com/400x250',
      views: 890,
      likes: 73
    },
    {
      id: 7,
      title: 'Stress và ảnh hưởng đến sức khỏe giới tính',
      excerpt: 'Cách stress ảnh hưởng đến sức khỏe giới tính và các phương pháp quản lý stress hiệu quả.',
      content: 'Nội dung chi tiết về stress...',
      author: 'BS. Vũ Minh Tuấn',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-01',
      readTime: '7 phút đọc',
      category: 'Tâm lý',
      tags: ['Stress', 'Tâm lý', 'Sức khỏe'],
      image: 'https://via.placeholder.com/400x250',
      views: 1320,
      likes: 98
    },
    {
      id: 8,
      title: 'Giáo dục giới tính cho thanh thiếu niên',
      excerpt: 'Tầm quan trọng của giáo dục giới tính đúng đắn cho lứa tuổi thanh thiếu niên.',
      content: 'Nội dung chi tiết về giáo dục giới tính...',
      author: 'ThS. Lê Thị Mai',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2023-12-28',
      readTime: '9 phút đọc',
      category: 'Giáo dục',
      tags: ['Giáo dục', 'Thanh thiếu niên', 'Giới tính'],
      image: 'https://via.placeholder.com/400x250',
      views: 1680,
      likes: 134
    }
  ]);

  const categories = ['all', 'STI', 'Xét nghiệm', 'Sức khỏe sinh sản', 'Tâm lý', 'Kế hoạch hóa gia đình', 'Dinh dưỡng', 'Giáo dục'];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Sức Khỏe Giới Tính
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Chia sẻ kiến thức, kinh nghiệm và những thông tin hữu ích về chăm sóc sức khỏe giới tính
            </p>
          </div>
        </div>
      </section> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full lg:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tất cả danh mục' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-gray-600">
            Tìm thấy {filteredPosts.length} bài viết
            {searchTerm && ` cho "${searchTerm}"`}
            {selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{post.author}</p>
                      <p>{formatDate(post.publishDate)}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readTime}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                  >
                    Đọc thêm
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy bài viết nào</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;