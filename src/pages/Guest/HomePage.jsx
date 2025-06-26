import React from 'react';

const Homepage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Chăm sóc sức khỏe 
                <span className="text-blue-600"> giới tính</span> 
                <br />chuyên nghiệp
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Dịch vụ xét nghiệm STI, tư vấn sức khỏe giới tính và chăm sóc y tế 
                bảo mật, an toàn với đội ngũ chuyên gia hàng đầu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 shadow-lg hover:shadow-xl">
                  Đặt lịch ngay
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300">
                  Tư vấn miễn phí
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bảo mật tuyệt đối</h3>
                  <p className="text-gray-600">
                    Thông tin cá nhân và kết quả xét nghiệm được bảo mật 100% 
                    theo tiêu chuẩn quốc tế.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe giới tính với công nghệ hiện đại 
              và đội ngũ y bác sĩ chuyên nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Xét nghiệm STI</h3>
              <p className="text-gray-600 mb-6">
                Xét nghiệm toàn diện các bệnh lây truyền qua đường tình dục với 
                kết quả nhanh chóng và chính xác.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tư vấn trực tuyến</h3>
              <p className="text-gray-600 mb-6">
                Tư vấn sức khỏe giới tính với các chuyên gia y tế qua video call 
                bảo mật 24/7.
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt lịch hẹn</h3>
              <p className="text-gray-600 mb-6">
                Hệ thống đặt lịch hẹn thông minh, linh hoạt theo thời gian 
                phù hợp với bạn.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kết quả xét nghiệm</h3>
              <p className="text-gray-600 mb-6">
                Tra cứu kết quả xét nghiệm trực tuyến an toàn với mã bảo mật 
                cá nhân.
              </p>
              <button className="text-red-600 font-semibold hover:text-red-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Giáo dục sức khỏe</h3>
              <p className="text-gray-600 mb-6">
                Tài liệu và khóa học về sức khỏe giới tính từ các chuyên gia 
                y tế hàng đầu.
              </p>
              <button className="text-yellow-600 font-semibold hover:text-yellow-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hỗ trợ tâm lý</h3>
              <p className="text-gray-600 mb-6">
                Dịch vụ tư vấn tâm lý chuyên nghiệp cho các vấn đề về 
                sức khỏe giới tính.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition duration-300">
                Tìm hiểu thêm →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn HealthCare+?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Chúng tôi hiểu rằng sức khỏe giới tính là một chủ đề nhạy cảm và cần được 
                xử lý với sự chuyên nghiệp, bảo mật tuyệt đối. Với hơn 10 năm kinh nghiệm 
                trong lĩnh vực y tế, chúng tôi cam kết mang đến dịch vụ chất lượng cao nhất.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Đội ngũ chuyên gia</h3>
                    <p className="text-gray-600">Bác sĩ chuyên khoa có kinh nghiệm lâu năm trong lĩnh vực sức khỏe giới tính.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Công nghệ hiện đại</h3>
                    <p className="text-gray-600">Trang thiết bị y tế tiên tiến, đảm bảo kết quả chính xác và nhanh chóng.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bảo mật tuyệt đối</h3>
                    <p className="text-gray-600">Hệ thống bảo mật đa lớp, tuân thủ các tiêu chuẩn quốc tế về bảo vệ dữ liệu.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-gray-600">Năm kinh nghiệm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                    <div className="text-gray-600">Khách hàng tin tưởng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600">Hỗ trợ khẩn cấp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                    <div className="text-gray-600">Bảo mật thông tin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. 
              Hãy liên hệ ngay để được tư vấn miễn phí.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ quan tâm</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Chọn dịch vụ</option>
                    <option>Xét nghiệm STI</option>
                    <option>Tư vấn trực tuyến</option>
                    <option>Đặt lịch hẹn</option>
                    <option>Hỗ trợ tâm lý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tin nhắn</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tin nhắn của bạn..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Địa chỉ</h4>
                      <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Điện thoại</h4>
                      <p className="text-gray-600">+84 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@healthcare.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Giờ làm việc</h4>
                      <p className="text-gray-600">24/7 - Hỗ trợ khẩn cấp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Hotline khẩn cấp</h3>
                <p className="text-blue-100 mb-6">
                  Gọi ngay khi cần hỗ trợ y tế khẩn cấp hoặc tư vấn nhanh
                </p>
                <div className="text-3xl font-bold mb-4">1900 1234</div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                  Gọi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
