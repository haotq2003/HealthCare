import React, { useState } from 'react';
import ConsultantLayout from '../../components/Consultant/ConsultantLayout';

const QuestionsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Sample questions data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      userId: 'user123',
      userName: 'Nguyễn Thị A',
      userAvatar: 'https://via.placeholder.com/40',
      question: 'Tôi có triệu chứng ngứa và đau khi đi tiểu, có phải là nhiễm trùng không? Tôi rất lo lắng và không biết nên làm gì.',
      category: 'STI',
      priority: 'high',
      status: 'pending',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      isAnonymous: false,
      tags: ['triệu chứng', 'nhiễm trùng', 'đau'],
      attachments: []
    },
    {
      id: 2,
      userId: 'user456',
      userName: 'Trần Văn B',
      userAvatar: 'https://via.placeholder.com/40',
      question: 'Sau quan hệ không an toàn, tôi nên xét nghiệm gì và khi nào? Chi phí khoảng bao nhiêu?',
      category: 'Xét nghiệm',
      priority: 'medium',
      status: 'pending',
      createdAt: '2024-01-19T15:45:00Z',
      updatedAt: '2024-01-19T15:45:00Z',
      isAnonymous: true,
      tags: ['xét nghiệm', 'quan hệ không an toàn'],
      attachments: []
    },
    {
      id: 3,
      userId: 'user789',
      userName: 'Lê Thị C',
      userAvatar: 'https://via.placeholder.com/40',
      question: 'Thuốc tránh thai khẩn cấp có tác dụng phụ gì không? Tôi vừa sử dụng và cảm thấy buồn nôn.',
      category: 'Kế hoạch hóa gia đình',
      priority: 'low',
      status: 'answered',
      createdAt: '2024-01-18T09:20:00Z',
      updatedAt: '2024-01-18T14:30:00Z',
      answer: 'Thuốc tránh thai khẩn cấp có thể gây một số tác dụng phụ như buồn nôn, đau đầu, mệt mỏi. Đây là phản ứng bình thường và thường tự hết sau 1-2 ngày. Nếu triệu chứng kéo dài hoặc nghiêm trọng, bạn nên đến gặp bác sĩ.',
      answeredAt: '2024-01-18T14:30:00Z',
      answeredBy: 'BS. Nguyễn Văn An',
      isAnonymous: false,
      tags: ['thuốc tránh thai', 'tác dụng phụ'],
      attachments: []
    },
    {
      id: 4,
      userId: 'user101',
      userName: 'Phạm Văn D',
      userAvatar: 'https://via.placeholder.com/40',
      question: 'Tôi bị stress và lo lắng về vấn đề sinh lý. Điều này có ảnh hưởng đến sức khỏe sinh sản không?',
      category: 'Tâm lý',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-01-17T11:15:00Z',
      updatedAt: '2024-01-17T16:20:00Z',
      isAnonymous: false,
      tags: ['stress', 'tâm lý', 'sinh lý'],
      attachments: []
    },
    {
      id: 5,
      userId: 'user202',
      userName: 'Hoàng Thị E',
      userAvatar: 'https://via.placeholder.com/40',
      question: 'Chu kỳ kinh nguyệt của tôi không đều, có khi 25 ngày, có khi 35 ngày. Có bình thường không?',
      category: 'Sức khỏe sinh sản',
      priority: 'low',
      status: 'answered',
      createdAt: '2024-01-16T08:30:00Z',
      updatedAt: '2024-01-16T17:45:00Z',
      answer: 'Chu kỳ kinh nguyệt từ 21-35 ngày được coi là bình thường. Tuy nhiên, nếu chu kỳ thay đổi đột ngột hoặc có triệu chứng bất thường khác, bạn nên thăm khám để được tư vấn cụ thể.',
      answeredAt: '2024-01-16T17:45:00Z',
      answeredBy: 'BS. Trần Thị Bình',
      isAnonymous: false,
      tags: ['chu kỳ kinh nguyệt', 'sức khỏe phụ nữ'],
      attachments: []
    }
  ]);

  const tabs = [
    { id: 'pending', name: 'Chờ trả lời', count: questions.filter(q => q.status === 'pending').length },
    { id: 'in_progress', name: 'Đang xử lý', count: questions.filter(q => q.status === 'in_progress').length },
    { id: 'answered', name: 'Đã trả lời', count: questions.filter(q => q.status === 'answered').length },
    { id: 'all', name: 'Tất cả', count: questions.length }
  ];

  const priorities = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'high', label: 'Ưu tiên cao' },
    { value: 'medium', label: 'Ưu tiên trung bình' },
    { value: 'low', label: 'Ưu tiên thấp' }
  ];

  const categories = ['STI', 'Xét nghiệm', 'Sức khỏe sinh sản', 'Tâm lý', 'Kế hoạch hóa gia đình', 'Dinh dưỡng'];

  // Filter questions based on active tab, search term, and priority
  const filteredQuestions = questions.filter(question => {
    const matchesTab = activeTab === 'all' || question.status === activeTab;
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || question.priority === filterPriority;
    return matchesTab && matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'answered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ trả lời';
      case 'in_progress': return 'Đang xử lý';
      case 'answered': return 'Đã trả lời';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const handleAnswerQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    setShowAnswerModal(true);
  };

  const handleSubmitAnswer = () => {
    if (answerText.trim()) {
      const updatedQuestions = questions.map(q => 
        q.id === selectedQuestion.id 
          ? {
              ...q,
              status: 'answered',
              answer: answerText,
              answeredAt: new Date().toISOString(),
              answeredBy: 'BS. Nguyễn Văn An',
              updatedAt: new Date().toISOString()
            }
          : q
      );
      setQuestions(updatedQuestions);
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      setAnswerText('');
    }
  };

  const handleMarkInProgress = (questionId) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId 
        ? { ...q, status: 'in_progress', updatedAt: new Date().toISOString() }
        : q
    );
    setQuestions(updatedQuestions);
  };

  return (
   
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
      
        

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm câu hỏi, người dùng, danh mục..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="lg:w-48">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="divide-y divide-gray-200">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <div key={question.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={question.userAvatar}
                            alt={question.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {question.isAnonymous ? 'Người dùng ẩn danh' : question.userName}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(question.createdAt)}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(question.priority)}`}>
                            {question.priority === 'high' ? 'Ưu tiên cao' : 
                             question.priority === 'medium' ? 'Ưu tiên TB' : 'Ưu tiên thấp'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(question.status)}`}>
                            {getStatusText(question.status)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-900 mb-2">{question.question}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {question.category}
                            </span>
                            {question.tags.map((tag, index) => (
                              <span key={index} className="text-gray-600">#{tag}</span>
                            ))}
                          </div>
                        </div>

                        {question.status === 'answered' && question.answer && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center mb-2">
                              <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm font-medium text-green-800">
                                Đã trả lời bởi {question.answeredBy} - {formatDate(question.answeredAt)}
                              </span>
                            </div>
                            <p className="text-green-700">{question.answer}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {question.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleMarkInProgress(question.id)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
                            >
                              Đang xử lý
                            </button>
                            <button
                              onClick={() => handleAnswerQuestion(question)}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-200"
                            >
                              Trả lời
                            </button>
                          </>
                        )}
                        {question.status === 'in_progress' && (
                          <button
                            onClick={() => handleAnswerQuestion(question)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-200"
                          >
                            Trả lời
                          </button>
                        )}
                        {question.status === 'answered' && (
                          <button
                            onClick={() => handleAnswerQuestion(question)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có câu hỏi nào</h3>
                  <p className="text-gray-600">Chưa có câu hỏi nào phù hợp với bộ lọc hiện tại</p>
                </div>
              )}
            </div>
          </div>
        </div>
   
      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedQuestion.status === 'answered' ? 'Chỉnh sửa câu trả lời' : 'Trả lời câu hỏi'}
                </h3>
                <button
                  onClick={() => setShowAnswerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Question Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={selectedQuestion.userAvatar}
                    alt={selectedQuestion.userName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedQuestion.isAnonymous ? 'Người dùng ẩn danh' : selectedQuestion.userName}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(selectedQuestion.createdAt)}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {selectedQuestion.category}
                  </span>
                </div>
                <p className="text-gray-900">{selectedQuestion.question}</p>
              </div>

              {/* Answer Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu trả lời của bạn
                </label>
                <textarea
                  value={answerText || selectedQuestion.answer || ''}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập câu trả lời chi tiết và hữu ích cho người dùng..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Hãy cung cấp thông tin chính xác, hữu ích và dễ hiểu. Tránh đưa ra chẩn đoán cụ thể mà khuyến khích người dùng đến gặp bác sĩ khi cần thiết.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowAnswerModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
              >
                {selectedQuestion.status === 'answered' ? 'Cập nhật câu trả lời' : 'Gửi câu trả lời'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default QuestionsPage;
