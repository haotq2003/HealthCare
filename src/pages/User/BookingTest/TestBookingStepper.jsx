import React from "react";
import { useNavigate } from "react-router-dom";
import "./TestBookingStepper.scss";

const steps = [
  { label: "Chọn xét nghiệm", path: "/user/test-booking" },
  { label: "Chọn lịch hẹn", path: "/user/test-booking/schedule" },
  { label: "Xác nhận lịch", path: "/user/test-booking/confirm" },
];

const TestBookingStepper = ({ activeStep = 1 }) => {
  const navigate = useNavigate();

  return (
    <div className="test-booking-stepper">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div
            className={`step${activeStep === idx + 1 ? " active" : ""}${activeStep > idx + 1 ? " done" : ""}`}
            onClick={() => navigate(step.path)}
            style={{ cursor: "pointer" }}
          >
            <span className="circle">{idx + 1}</span>
            <span>{step.label}</span>
          </div>
          {idx < steps.length - 1 && <div className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TestBookingStepper; 