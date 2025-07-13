import React from "react";
import './TestDetailModal.scss';
import { formatVietnameseCurrencyVND } from '../../../utils/currencyFormatter';

const TestDetailModal = ({ open, onClose, test }) => {
  if (!open || !test) return null;
  return (
    <div className="test-detail-modal-overlay" onClick={onClose}>
      <div className="test-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{test.name}</h2>
        {test.badge && <span className="badge">{test.badge}</span>}
        <p className="desc">{test.desc}</p>
        <div className="meta">
          <div><b>Loại:</b> {test.type}</div>
          <div><b>Thời gian:</b> {test.time}</div>
          <div><b>Giá:</b> {formatVietnameseCurrencyVND(test.price * 1000)}</div>
          <div><b>Kết quả:</b> {test.result}</div>
        </div>
        {test.details && (
          <div className="disease-details">
            <h3>Chi tiết các xét nghiệm:</h3>
            <ul>
              {test.details.map((d, idx) => (
                <li key={idx}><b>{d.name}:</b> {d.info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetailModal; 