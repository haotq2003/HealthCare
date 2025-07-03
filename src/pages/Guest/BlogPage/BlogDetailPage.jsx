import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sample blog data (in real app, this would come from API)
  const blogPosts = [
    {
      id: 1,
      title: 'Hiểu về các bệnh lây truyền qua đường tình dục phổ biến',
      excerpt: 'Tìm hiểu về các loại STI phổ biến, triệu chứng và cách phòng ngừa hiệu quả để bảo vệ sức khỏe của bạn.',
      content: `
        <h2>Giới thiệu về STI</h2>
        <p>Các bệnh lây truyền qua đường tình dục (STI) là những nhiễm trùng được truyền từ người này sang người khác thông qua hoạt động tình dục. Đây là một vấn đề sức khỏe công cộng quan trọng ảnh hưởng đến hàng triệu người trên toàn thế giới.</p>
        
        <h3>Các loại STI phổ biến</h3>
        <ul>
          <li><strong>Chlamydia:</strong> Một trong những STI phổ biến nhất, thường không có triệu chứng rõ ràng.</li>
          <li><strong>Gonorrhea:</strong> Có thể gây viêm niệu đạo, cổ tử cung và các cơ quan sinh sản khác.</li>
          <li><strong>Syphilis:</strong> Phát triển qua nhiều giai đoạn nếu không được điều trị.</li>
          <li><strong>Herpes:</strong> Gây ra các vết loét đau đớn ở vùng sinh dục.</li>
          <li><strong>HIV:</strong> Tấn công hệ miễn dịch của cơ thể.</li>
        </ul>
        
        <h3>Triệu chứng cần chú ý</h3>
        <p>Nhiều STI có thể không có triệu chứng rõ ràng, đặc biệt ở giai đoạn đầu. Tuy nhiên, một số dấu hiệu cảnh báo bao gồm:</p>
        <ul>
          <li>Đau hoặc khó chịu khi đi tiểu</li>
          <li>Dịch tiết bất thường từ vùng sinh dục</li>
          <li>Đau trong quan hệ tình dục</li>
          <li>Vết loét hoặc mụn nước ở vùng sinh dục</li>
          <li>Ngứa hoặc kích ứng vùng sinh dục</li>
        </ul>
        
        <h3>Phòng ngừa STI</h3>
        <p>Có nhiều cách để giảm nguy cơ mắc STI:</p>
        <ul>
          <li>Sử dụng bao cao su đúng cách và thường xuyên</li>
          <li>Hạn chế số lượng bạn tình</li>
          <li>Xét nghiệm định kỳ</li>
          <li>Tiêm vaccine phòng ngừa (như vaccine HPV)</li>
          <li>Giao tiếp cởi mở với bạn tình về tình trạng sức khỏe</li>
        </ul>
        
        <h3>Tầm quan trọng của xét nghiệm</h3>
        <p>Xét nghiệm định kỳ là chìa khóa để phát hiện sớm và điều trị kịp thời các STI. Nhiều STI có thể được chữa khỏi hoàn toàn nếu được phát hiện và điều trị sớm.</p>
        
        <h3>Kết luận</h3>
        <p>Hiểu biết về STI là bước đầu tiên để bảo vệ bản thân và người thân. Nếu bạn có bất kỳ lo ngại nào về sức khỏe sinh sản, hãy tham khảo ý kiến của chuyên gia y tế.</p>
      `,
      author: 'BS. Nguyễn Văn An',
      authorAvatar: 'https://via.placeholder.com/40',
      authorBio: 'Bác sĩ chuyên khoa Sản phụ khoa với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe sinh sản.',
      publishDate: '2024-01-15',
      readTime: '5 phút đọc',
      category: 'STI',
      tags: ['STI', 'Phòng ngừa', 'Sức khỏe'],
      image: 'https://via.placeholder.com/800x400',
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'Tầm quan trọng của việc xét nghiệm định kỳ',
      excerpt: 'Xét nghiệm định kỳ là chìa khóa để phát hiện sớm và điều trị kịp thời các vấn đề sức khỏe sinh sản.',
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
      author: 'BS. Lê Minh Châu',
      authorAvatar: 'https://via.placeholder.com/40',
      publishDate: '2024-01-10',
      readTime: '6 phút đọc',
      category: 'Sức khỏe sinh sản',
      tags: ['Sức khỏe', 'Lối sống', 'Dinh dưỡng'],
      image: 'https://via.placeholder.com/400x250',
      views: 1450,
      likes: 112
    }
  ];

  // Sample comments data
  const sampleComments = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      email: 'mai@example.com',
      message: 'Bài viết rất hữu ích! Cảm ơn bác sĩ đã chia sẻ những thông tin quan trọng này.',
      date: '2024-01-16',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      email: 'nam@example.com',
      message: 'Tôi đã học được rất nhiều từ bài viết này. Sẽ đi xét nghiệm định kỳ theo lời khuyên.',
      date: '2024-01-16',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      email: 'hoa@example.com',
      message: 'Thông tin rất chi tiết và dễ hiểu. Mong có thêm nhiều bài viết như thế này.',
      date: '2024-01-17',
      avatar: 'https://via.placeholder.com/40'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const foundPost = blogPosts.find(p => p.id === parseInt(id));
      setPost(foundPost);
      
      // Get related posts (same category, excluding current post)
      const related = blogPosts
        .filter(p => p.id !== parseInt(id) && p.category === foundPost?.category)
        .slice(0, 3);
      setRelatedPosts(related);
      
      setComments(sampleComments);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.email && newComment.message) {
      const comment = {
        id: comments.length + 1,
        ...newComment,
        date: new Date().toISOString().split('T')[0],
        avatar: 'https://via.placeholder.com/40'
      };
      setComments([...comments, comment]);
      setNewComment({ name: '', email: '', message: '' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            Quay lại danh sách blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span>{formatDate(post.publishDate)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views} lượt xem
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likes} lượt thích
              </span>
            </div>
          </div>
          
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl"
          />
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        {post.authorBio && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Về tác giả</h3>
            <div className="flex items-start">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{post.author}</h4>
                <p className="text-gray-600">{post.authorBio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Bình luận ({comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newComment.name}
                  onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bình luận <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newComment.message}
                onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Gửi bình luận
            </button>
          </form>
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{comment.name}</h4>
                      <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition duration-200">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                    />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{relatedPost.author}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
