import React from "react";
import { UserCheck, Calendar, Users } from "lucide-react";
import "./ConsultantHeader.scss";

const ConsultantHeader = ({ activeStep = 1 }) => {
  const steps = [
    {
      id: 1,
      title: "Chọn chuyên gia",
      icon: UserCheck,
      path: "/user/consultants"
    },
    {
      id: 2,
      title: "Chọn lịch hẹn",
      icon: Calendar,
      path: "/user/booking"
    },
    {
      id: 3,
      title: "Xác nhận",
      icon: Users,
      path: "/user/booking/confirm"
    }
  ];

  return (
    <div className="consultant-header">
      <div className="consultant-header-content">
        <h1 className="consultant-header-title">Đặt lịch tư vấn</h1>
        <p className="consultant-header-subtitle">
          Kết nối với các chuyên gia để được hỗ trợ và tư vấn chuyên nghiệp.
        </p>
        
        {/* Stepper với icons */}
        <div className="consultant-header-stepper">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`consultant-header-step ${activeStep >= step.id ? 'active' : ''}`}>
                <div className="consultant-header-step-icon">
                  <step.icon size={20} />
                </div>
                <span className="consultant-header-step-title">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`consultant-header-step-line ${activeStep > step.id ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultantHeader; 