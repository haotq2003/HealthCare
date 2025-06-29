import React from "react";
import "./BookingStepper.scss";

const steps = [
  { label: "Chọn chuyên gia", icon: "fa-user-check" },
  { label: "Chọn lịch hẹn", icon: "fa-calendar-alt" },
  { label: "Xác nhận", icon: "fa-user-circle" },
];

const BookingStepper = ({ currentStep = 1 }) => (
  <div className="booking-stepper">
    {steps.map((step, idx) => (
      <div key={step.label} className={`step${currentStep === idx + 1 ? " active" : ""}`}> 
        <div className="step-icon">
          <i className={`fas ${step.icon}`}></i>
        </div>
        <div className="step-label">{step.label}</div>
        {idx < steps.length - 1 && <div className="step-line"></div>}
      </div>
    ))}
  </div>
);

export default BookingStepper; 