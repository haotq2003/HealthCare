import React from "react";
import "./TestCartSidebar.scss";

const TestCartSidebar = ({ selectedTests, testList, onRemove, onContinue, open, setOpen }) => {
  const total = testList
    .filter((test) => selectedTests.includes(test.id))
    .reduce((sum, test) => sum + test.price, 0);

  return (
    <>
      <div className={`test-cart-sidebar${open ? " open" : ""}`}>
        <div className="cart-header">
          <span>Giỏ xét nghiệm</span>
          <button className="close-btn" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="cart-list">
          {selectedTests.length === 0 ? (
            <div className="cart-empty">Chưa có xét nghiệm nào!</div>
          ) : (
            testList
              .filter((test) => selectedTests.includes(test.id))
              .map((test) => (
                <div className="cart-item" key={test.id}>
                  <div>
                    <b>{test.name}</b>
                    <div className="cart-meta">
                      <span>{test.time}</span>
                      <span className="cart-price">{test.price}k</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(test.id)}>✕</button>
                </div>
              ))
          )}
        </div>
        <div className="cart-footer">
          <div>
            <b>Tổng cộng:</b> <span className="cart-total">{total.toLocaleString()}k VND</span>
          </div>
          <button
            className="cart-continue"
            disabled={selectedTests.length === 0}
            onClick={onContinue}
          >
            Tiếp tục
          </button>
        </div>
      </div>
      {open && <div className="test-cart-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default TestCartSidebar; 