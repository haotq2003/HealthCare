import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestBookingHeader from "./TestBookingHeader";
import TestCartSidebar from "./TestCartSidebar";
import TestDetailModal from "./TestDetailModal";
import { Eye } from 'lucide-react';
import "./UserTestBookingPage.scss";

const testTabs = [
  { label: "Gói xét nghiệm", value: "browse" },
];

const testFilters = {
  type: ["Tất cả loại", "Tổng hợp", "Tế bào", "Máu"],
  price: ["Tất cả giá", "< 200k", "200k - 500k", "> 500k"],
  time: ["Tất cả thời gian", "< 15 phút", "15-30 phút", "> 30 phút"],
};

const testList = [
  {
    id: 1,
    name: "Gói xét nghiệm STIs cơ bản",
    desc: "Gói xét nghiệm cơ bản bao gồm: HIV, Giang mai, Lậu, Chlamydia",
    details: [
      { name: "HIV", info: "Phát hiện virus HIV gây suy giảm miễn dịch." },
      { name: "Giang mai", info: "Phát hiện xoắn khuẩn Treponema pallidum." },
      { name: "Lậu", info: "Phát hiện vi khuẩn Neisseria gonorrhoeae." },
      { name: "Chlamydia", info: "Phát hiện vi khuẩn Chlamydia trachomatis." }
    ],
    time: "30 phút",
    price: 450,
    result: "Kết quả sau 3 ngày",
    type: "Tổng hợp",
    badge: "Phổ biến",
    recommended: true,
  },
  {
    id: 2,
    name: "Gói xét nghiệm STIs toàn diện",
    desc: "Gói xét nghiệm toàn diện gồm: HIV, Giang mai, Lậu, Chlamydia, Herpes, HPV",
    details: [
      { name: "HIV", info: "Phát hiện virus HIV gây suy giảm miễn dịch." },
      { name: "Giang mai", info: "Phát hiện xoắn khuẩn Treponema pallidum." },
      { name: "Lậu", info: "Phát hiện vi khuẩn Neisseria gonorrhoeae." },
      { name: "Chlamydia", info: "Phát hiện vi khuẩn Chlamydia trachomatis." },
      { name: "Herpes", info: "Phát hiện virus Herpes simplex (HSV)." },
      { name: "HPV", info: "Phát hiện virus Human papillomavirus." }
    ],
    time: "45 phút",
    price: 800,
    result: "Kết quả sau 5 ngày",
    type: "Tổng hợp",
    badge: "Phổ biến",
    recommended: false,
  },
  {
    id: 3,
    name: "Xét nghiệm Chlamydia",
    desc: "Xét nghiệm phát hiện vi khuẩn Chlamydia trachomatis, nguyên nhân phổ biến của nhiễm khuẩn đường sinh dục.",
    details: [
      { name: "Chlamydia", info: "Phát hiện vi khuẩn Chlamydia trachomatis." }
    ],
    time: "10 phút",
    price: 130,
    result: "Kết quả sau 3 ngày",
    type: "Tế bào",
    badge: null,
    recommended: false,
  },
  {
    id: 4,
    name: "Xét nghiệm Giang mai (Syphilis)",
    desc: "Xét nghiệm máu phát hiện vi khuẩn Treponema pallidum gây bệnh giang mai",
    details: [
      { name: "Giang mai", info: "Phát hiện xoắn khuẩn Treponema pallidum." }
    ],
    time: "10 phút",
    price: 120,
    result: "Kết quả sau 2 ngày",
    type: "Máu",
    badge: null,
    recommended: false,
  },
];

const UserTestBookingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [filters, setFilters] = useState({ type: "Tất cả loại", price: "Tất cả giá", time: "Tất cả thời gian" });
  const [selectedTests, setSelectedTests] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTest, setModalTest] = useState(null);

  const handleSelect = (id) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRemove = (id) => {
    setSelectedTests((prev) => prev.filter((tid) => tid !== id));
  };

  const total = testList
    .filter((test) => selectedTests.includes(test.id))
    .reduce((sum, test) => sum + test.price, 0);

  const handleContinue = () => {
    setActiveStep(2);
  };

  return (
    <div className="test-booking-page">
      <TestBookingHeader 
        title="Đặt lịch xét nghiệm STIs"
        description="Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp"
        activeStep={activeStep}
        selectedTests={selectedTests}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      />

      {activeStep === 1 && <>
        <div className="test-booking-tabs">
          {testTabs.map((tab) => (
            <button
              key={tab.value}
              className={activeTab === tab.value ? "active" : ""}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="test-booking-filter">
          <div className="filter-title">
            <span className="icon">🔎</span> Bộ lọc tìm kiếm
          </div>
          <div className="filter-row">
            <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              {testFilters.type.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select value={filters.price} onChange={e => setFilters(f => ({ ...f, price: e.target.value }))}>
              {testFilters.price.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select value={filters.time} onChange={e => setFilters(f => ({ ...f, time: e.target.value }))}>
              {testFilters.time.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div className="test-booking-list">
          {testList.map((test) => {
            const isSelected = selectedTests.includes(test.id);
            return (
              <div className={`test-card${isSelected ? " selected" : ""}`} key={test.id}>
                <div className="test-card-header">
                  <span className="test-icon">🧪</span>
                  {test.type && <span className="test-type">Xét nghiệm {test.type}</span>}
                  {test.badge && <span className="test-badge">{test.badge}</span>}
                </div>
                <div className="test-card-title">{test.name}</div>
                <div className="test-card-desc">{test.desc}</div>
                <div className="test-card-meta">
                  <span>⏱ {test.time}</span>
                  <span className="test-price">$ {test.price}k</span>
                </div>
                <div className="test-card-result">{test.result}</div>
                <div className="test-card-actions">
                  <button
                    className={`test-card-add${isSelected ? " selected" : ""}`}
                    disabled={isSelected}
                    onClick={() => handleSelect(test.id)}
                  >
                    {isSelected ? "Đã chọn" : "Thêm vào giỏ"}
                  </button>
                  <button className="test-card-detail-btn" onClick={() => { setModalTest(test); setModalOpen(true); }} title="Xem chi tiết">
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      <TestDetailModal open={modalOpen} onClose={() => setModalOpen(false)} test={modalTest} />

      {/* Mini cart sidebar */}
      <TestCartSidebar
        selectedTests={selectedTests}
        testList={testList}
        onRemove={handleRemove}
        onContinue={handleContinue}
        open={cartOpen}
        setOpen={setCartOpen}
      />
    </div>
  );
};

export default UserTestBookingPage; 