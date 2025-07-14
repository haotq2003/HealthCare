import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestBookingHeader from "./TestBookingHeader";
import { Eye } from 'lucide-react';
import { API_URL } from "../../../config/apiURL";
import "./UserTestBookingPage.scss";
import ReactPaginate from 'react-paginate';
import { formatVietnameseCurrencyVND } from '../../../utils/currencyFormatter';

const testTabs = [
  { label: "Gói xét nghiệm", value: "browse" },
];

const UserTestBookingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [activeStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTest, setModalTest] = useState(null);
  const [testList, setTestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(testList.length / itemsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const pagedTests = testList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      
      // Fetch health tests
      const healthTestsResponse = await fetch(`${API_URL}/api/HealthTest`);
      const healthTests = await healthTestsResponse.json();
      
      // Fetch health test schedules
      const schedulesResponse = await fetch(`${API_URL}/api/HealthTestSchedule`);
      const schedules = await schedulesResponse.json();
      
      // Map the data according to requirements
      const mappedTests = healthTests.map(test => {
        // Find corresponding schedule for this test
        const schedule = schedules.find(s => s.healthTestId === test.id);
        
        return {
          id: test.id,
          name: test.name,
          desc: test.description,
          details: [
            { name: test.name, info: test.description }
          ],
          time: schedule ? `${schedule.slotDurationInMinutes} phút` : "30 phút",
          price: test.price,
          result: "Kết quả sau 3 ngày",
          type: "Xét nghiệm",
          badge: null,
          recommended: false,
        };
      });
      
      setTestList(mappedTests);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching test data:', err);
      setError('Không thể tải dữ liệu xét nghiệm');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="test-booking-page">
        <TestBookingHeader 
          title="Đặt lịch xét nghiệm STIs"
          description="Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp"
          activeStep={activeStep}
          selectedTests={[]}
          cartOpen={false}
          setCartOpen={() => {}}
        />
        <div className="loading-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-booking-page">
        <TestBookingHeader 
          title="Đặt lịch xét nghiệm STIs"
          description="Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp"
          activeStep={activeStep}
          selectedTests={[]}
          cartOpen={false}
          setCartOpen={() => {}}
        />
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={fetchTestData} className="retry-button">Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-booking-page">
      <TestBookingHeader 
        title="Đặt lịch xét nghiệm STIs"
        description="Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp"
        activeStep={activeStep}
        selectedTests={[]}
        cartOpen={false}
        setCartOpen={() => {}}
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
        <div className="test-booking-list">
          {pagedTests.map((test, idx) => (
            <div className={`test-card`} key={test.id} style={{ gridColumn: (idx % 3) + 1 }}>
              <div className="test-card-header">
                <span className="test-icon">🧪</span>
                <span className="test-type">Xét nghiệm</span>
                {test.badge && <span className="test-badge">{test.badge}</span>}
              </div>
              <div className="test-card-title">{test.name}</div>
              <div className="test-card-desc">{test.desc}</div>
              <div className="test-card-meta">
                <span>⏱ {test.time}</span>
                <span className="test-price">{formatVietnameseCurrencyVND(test.price)}</span>
              </div>
              <div className="test-card-result">{test.result}</div>
              <div className="test-card-actions">
                <button
                  className={`test-card-add`}
                  onClick={() => navigate("/user/test-booking/schedule", { state: { selectedTest: test } })}
                >
                  Đặt lịch xét nghiệm
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <ReactPaginate
            previousLabel={'←'}
            nextLabel={'→'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            breakClassName={'page-item'}
            disabledClassName={'disabled'}
          />
        </div>
      </>}

    </div>
  );
};

export default UserTestBookingPage; 