import React from "react";
import TestBookingStepper from "./TestBookingStepper";
import { ShoppingCart } from 'lucide-react';
import "./TestBookingHeader.scss";

const TestBookingHeader = ({ 
  title = "Đặt lịch xét nghiệm STIs", 
  description = "Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp",
  activeStep = 1,
  selectedTests = [],
  cartOpen = false,
  setCartOpen = () => {},
}) => {
  return (
    <div className="test-booking-header">
      <div className="header-main-row">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="header-action-row">
        <div className="header-action-row-inner">
          <TestBookingStepper activeStep={activeStep} />
          {activeStep === 1 && (
            <div className={`test-cart-fab${cartOpen ? " open" : ""}`} onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart size={32} />
              {selectedTests.length > 0 && <span className="cart-badge">{selectedTests.length}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestBookingHeader; 