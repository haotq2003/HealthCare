import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const orderInfo = query.get("vnp_OrderInfo");
  const amountRaw = query.get("vnp_Amount");
  const responseCode = query.get("vnp_ResponseCode");
  const transactionStatus = query.get("vnp_TransactionStatus");
  const secureHash = query.get("vnp_SecureHash");
  const bankCode = query.get("vnp_BankCode");
  const txnRef = query.get("vnp_TxnRef");

  const [userId, serviceId] = orderInfo?.split("_") || [];
  const amount = parseInt(amountRaw || "0") / 100;

  const [updated, setUpdated] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    const savePayment = async () => {
      try {
        if (responseCode === "00" && serviceId && !calledRef.current) {
          calledRef.current = true;

          await fetch(
            `https://localhost:7276/api/TestSlots/${serviceId}/updateStatus`,
            { method: "PATCH" }
          );

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
            headers: { "Content-Type": "application/json" },
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
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [updated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {updated ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã sử dụng dịch vụ của phòng khám.
            </p>
            <div className="mt-4 text-left w-full text-gray-700">
              <p>
                <strong>Số tiền:</strong>{" "}
                {amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p>
                <strong>Mã giao dịch:</strong> {txnRef}
              </p>
              <p>
                <strong>Ngân hàng:</strong> {bankCode}
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Bạn sẽ được chuyển hướng sau vài giây...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-yellow-500 w-12 h-12 mb-4" />
            <h1 className="text-xl font-semibold text-yellow-600">
              Đang xử lý giao dịch...
            </h1>
            <p className="text-gray-600 mt-2">
              Vui lòng chờ trong giây lát, chúng tôi đang xác nhận thông tin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
