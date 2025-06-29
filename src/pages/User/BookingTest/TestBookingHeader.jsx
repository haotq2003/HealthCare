import React from "react";
import TestBookingStepper from "./TestBookingStepper";
import "./TestBookingHeader.scss";

const TestBookingHeader = ({ 
  title = "Đặt lịch xét nghiệm STIs", 
  description = "Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp",
  activeStep = 1 
}) => {
  return (
    <div className="test-booking-header">
      <h1>{title}</h1>
      <p>{description}</p>
      <TestBookingStepper activeStep={activeStep} />
    </div>
  );
};

export default TestBookingHeader; 