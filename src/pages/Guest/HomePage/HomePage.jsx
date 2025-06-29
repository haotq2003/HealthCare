import React from "react";
import './HomePage.scss';

const experts = [
  { name: "BS. Nguyễn Văn A", title: "Chuyên gia Sản phụ khoa", img: "https://randomuser.me/api/portraits/men/32.jpg", quote: "Tận tâm vì sức khỏe cộng đồng." },
  { name: "BS. Trần Thị B", title: "Chuyên gia Xét nghiệm", img: "https://randomuser.me/api/portraits/women/44.jpg", quote: "Chính xác và bảo mật là ưu tiên số 1." },
  { name: "BS. Lê Văn C", title: "Tư vấn viên sức khỏe", img: "https://randomuser.me/api/portraits/men/65.jpg", quote: "Luôn lắng nghe và đồng hành cùng bạn." },
];

const feedbacks = [
  { name: "Ngọc Lan", text: "Dịch vụ rất chuyên nghiệp, tôi cảm thấy an tâm khi sử dụng.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Minh Tuấn", text: "Tư vấn tận tình, kết quả xét nghiệm nhanh chóng.", avatar: "https://randomuser.me/api/portraits/men/71.jpg" },
  { name: "Hồng Nhung", text: "Giao diện dễ dùng, bảo mật tốt, sẽ giới thiệu bạn bè!", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
];

const blogs = [
  { title: "5 điều cần biết về sức khỏe giới tính", date: "12/06/2024", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", link: "#" },
  { title: "Làm sao để phòng tránh STIs hiệu quả?", date: "10/06/2024", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", link: "#" },
  { title: "Tư vấn sức khỏe sinh sản miễn phí", date: "08/06/2024", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", link: "#" },
];

const faqs = [
  { q: "Tôi có thể đặt lịch xét nghiệm online không?", a: "Bạn hoàn toàn có thể đặt lịch xét nghiệm trực tuyến qua website của chúng tôi." },
  { q: "Thông tin cá nhân của tôi có được bảo mật?", a: "Chúng tôi cam kết bảo mật tuyệt đối mọi thông tin khách hàng." },
  { q: "Kết quả xét nghiệm có chính xác không?", a: "Kết quả được thực hiện bởi chuyên gia, đảm bảo độ chính xác 99.9%." },
];

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Chăm sóc sức khỏe <span className="highlight">giới tính</span> toàn diện
          </h1>
          <p className="subtitle">
            Dịch vụ tư vấn, xét nghiệm, theo dõi sức khỏe sinh sản và giới tính với đội ngũ chuyên gia hàng đầu, bảo mật tuyệt đối.
          </p>
          <div className="hero-actions">
            <button className="primary-btn">Đặt lịch tư vấn</button>
            <button className="secondary-btn">Đặt lịch xét nghiệm</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://www.intellis.io/hubfs/Healthcare-technology.jpg" alt="HealthCare Hero" />
        </div>
      </section>
      {/* Stats Section */}
      <section className="stats-section">
        <div>
          <span className="stats-number">10,000+</span>
          <span>Khách hàng tin tưởng</span>
        </div>
        <div>
          <span className="stats-number">50+</span>
          <span>Chuyên gia tư vấn</span>
        </div>
        <div>
          <span className="stats-number">99.9%</span>
          <span>Độ chính xác xét nghiệm</span>
        </div>
        <div>
          <span className="stats-number">24/7</span>
          <span>Hỗ trợ trực tuyến</span>
        </div>
      </section>
      {/* Services Section */}
      <section className="services-section">
        <h2>Dịch vụ của chúng tôi</h2>
        <p>Cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe giới tính chuyên nghiệp</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon"><span role="img" aria-label="calendar">📅</span></div>
            <h3>Tư vấn trực tuyến</h3>
            <p>Tư vấn với chuyên gia về sức khỏe sinh sản và giáo dục giới tính</p>
            <button className="link-btn">Tìm hiểu thêm &rarr;</button>
          </div>
          <div className="service-card">
            <div className="service-icon"><span role="img" aria-label="test-tube">🧪</span></div>
            <h3>Xét nghiệm STIs</h3>
            <p>Xét nghiệm các bệnh lây truyền qua đường tình dục với độ chính xác cao</p>
            <button className="link-btn">Tìm hiểu thêm &rarr;</button>
          </div>
          <div className="service-card">
            <div className="service-icon"><span role="img" aria-label="cycle">📈</span></div>
            <h3>Theo dõi chu kỳ</h3>
            <p>Theo dõi chu kỳ kinh nguyệt và dự đoán thời kỳ rụng trứng</p>
            <button className="link-btn">Tìm hiểu thêm &rarr;</button>
          </div>
          <div className="service-card">
            <div className="service-icon"><span role="img" aria-label="faq">💬</span></div>
            <h3>Hỏi đáp</h3>
            <p>Đặt câu hỏi và nhận tư vấn từ các chuyên gia</p>
            <button className="link-btn">Tìm hiểu thêm &rarr;</button>
          </div>
        </div>
      </section>
      {/* Process Section */}
      <section className="process-section">
        <h2>Quy trình sử dụng dịch vụ</h2>
        <div className="process-grid">
          <div className="process-step">
            <div className="process-icon">📝</div>
            <h4>Đăng ký tài khoản</h4>
            <p>Tạo tài khoản miễn phí, bảo mật tuyệt đối.</p>
          </div>
          <div className="process-step">
            <div className="process-icon">📅</div>
            <h4>Đặt lịch tư vấn/xét nghiệm</h4>
            <p>Lựa chọn dịch vụ phù hợp và đặt lịch online.</p>
          </div>
          <div className="process-step">
            <div className="process-icon">👩‍⚕️</div>
            <h4>Gặp chuyên gia</h4>
            <p>Nhận tư vấn, xét nghiệm với chuyên gia giàu kinh nghiệm.</p>
          </div>
          <div className="process-step">
            <div className="process-icon">📊</div>
            <h4>Nhận kết quả & theo dõi</h4>
            <p>Xem kết quả online, nhận hướng dẫn chăm sóc sức khỏe cá nhân.</p>
          </div>
        </div>
      </section>
      {/* Experts Section */}
      <section className="experts-section">
        <h2>Đội ngũ chuyên gia</h2>
        <div className="experts-grid">
          {experts.map((e, idx) => (
            <div className="expert-card" key={idx}>
              <img src={e.img} alt={e.name} />
              <h4>{e.name}</h4>
              <span>{e.title}</span>
              <blockquote>“{e.quote}”</blockquote>
            </div>
          ))}
        </div>
      </section>
      {/* Feedback Section */}
      <section className="feedback-section">
        <h2>Khách hàng nói gì về chúng tôi?</h2>
        <div className="feedback-grid">
          {feedbacks.map((f, idx) => (
            <div className="feedback-card" key={idx}>
              <img src={f.avatar} alt={f.name} />
              <p>“{f.text}”</p>
              <span>{f.name}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Blog Section */}
      <section className="blog-section">
        <h2>Tin tức & Kiến thức</h2>
        <div className="blog-grid">
          {blogs.map((b, idx) => (
            <a className="blog-card" href={b.link} key={idx}>
              <img src={b.img} alt={b.title} />
              <div>
                <h4>{b.title}</h4>
                <span>{b.date}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Câu hỏi thường gặp</h2>
        <div className="faq-grid">
          {faqs.map((f, idx) => (
            <div className="faq-card" key={idx}>
              <h4>{f.q}</h4>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="cta-section">
        <h2>Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay</h2>
        <p>Đặt lịch tư vấn hoặc xét nghiệm để nhận được sự chăm sóc tốt nhất</p>
        <div className="cta-actions">
          <button className="primary-btn">Đặt lịch ngay</button>
          <button className="secondary-btn">Đặt câu hỏi</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 