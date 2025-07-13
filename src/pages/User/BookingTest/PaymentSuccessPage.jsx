import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const orderInfo = query.get('vnp_OrderInfo');
  const amountRaw = query.get('vnp_Amount');
  const responseCode = query.get('vnp_ResponseCode');
  const transactionStatus = query.get('vnp_TransactionStatus');
  const secureHash = query.get('vnp_SecureHash');
  const bankCode = query.get('vnp_BankCode');
  const txnRef = query.get('vnp_TxnRef');

  const [userId, serviceId] = orderInfo?.split('_') || [];
  const amount = parseInt(amountRaw || '0') / 100;

  const [updated, setUpdated] = useState(false);
  const calledRef = useRef(false); 

  useEffect(() => {
    const savePayment = async () => {
      try {
     
        if (responseCode === '00' && serviceId && !calledRef.current) {
          calledRef.current = true;

          await fetch(`https://localhost:7276/api/TestSlots/${serviceId}/updateStatus`, {
            method: "PATCH",
          });

          const paymentData = {
            txnRef,
            amount,
            orderInfo,
            responseCode,
            transactionStatus,
            secureHash,
            bankCode,
          };

          await fetch(`https://localhost:7276/api/vnpay/save-payment`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
          });

          setUpdated(true);
        }
      } catch (err) {
        console.error("Lỗi khi xử lý thanh toán:", err);
        setUpdated(false);
      }
    };

    savePayment();
  }, [responseCode, serviceId]);

  useEffect(() => {
    if (updated) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [updated, navigate]);

  return (
    <div className="p-10 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
      <p><strong>Số tiền:</strong> {amount.toLocaleString()} VND</p>
      {updated ? (
        <p className="text-green-500 mt-4">Cập nhật và lưu giao dịch thành công! Đang chuyển hướng...</p>
      ) : (
        <p className="text-yellow-500 mt-4">Đang xử lý giao dịch...</p>
      )}
      <p className="mt-4 text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
    </div>
  );
};

export default PaymentSuccessPage;
