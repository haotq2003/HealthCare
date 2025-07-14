import React, { useEffect, useState } from "react";
import axios from "axios";
import { RevenueService } from "../../services/RevenueService";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboardPage = () => {
  const [filter, setFilter] = useState("month");
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(2025);

  const [counts, setCounts] = useState({
    customerCount: 0,
    bookedTestSlotCount: 0,
    bookedAvailableSlotCount: 0,
  });

  const [chartBooking, setChartBooking] = useState([]);
  const [chartConsultation, setChartConsultation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchCounts = async () => {
        const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
           const [resCustomer, resTest, resConsult] = await Promise.all([
        axios.get("https://localhost:7276/api/Statistics/customer-count", {
          headers,
        }),
        axios.get(
          "https://localhost:7276/api/Statistics/booked-testslot-count",
          { headers }
        ),
        axios.get(
          "https://localhost:7276/api/Statistics/booked-available-slot-count",
          { headers }
        ),
      ]);
console.log(resTest.data.data.bookedTestSlotCount)
        setCounts({
          customerCount: resCustomer.data.data.customerCount,
          bookedTestSlotCount: resTest.data.data.bookedTestSlotCount,
          bookedAvailableSlotCount:
            resConsult.data.data.bookedAvailableSlotCount,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
            const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

        const query =
          filter === "month" ? `?Year=${year}&Month=${month}` : `?Year=${year}`;

      const [resBooking, resConsult] = await Promise.all([
        axios.get(
          `https://localhost:7276/api/Statistics/test-bookings/statistics${query}`,
          { headers }
        ),
        axios.get(
          `https://localhost:7276/api/Statistics/consultations/statistics${query}`,
          { headers }
        ),
      ]);

        const data =
          filter === "month"
            ? [1, 2, 3, 4].map((w) => ({
                name: `Tuần ${w}`,
                booking: resBooking.data.find((x) => x.week === w)?.count || 0,
                consultation:
                  resConsult.data.find((x) => x.week === w)?.count || 0,
              }))
            : Array.from({ length: 12 }, (_, i) => ({
                name: `Tháng ${i + 1}`,
                booking:
                  resBooking.data.find((x) => x.month === i + 1)?.count || 0,
                consultation:
                  resConsult.data.find((x) => x.month === i + 1)?.count || 0,
              }));

        setChartBooking(data);
        setChartConsultation(data);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };

    fetchCharts();
  }, [filter, month, year]);

  // Fetch dữ liệu doanh thu
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setRevenueLoading(true);
        const response = await RevenueService.getRevenue();
        setRevenueData(response.data);
        setRevenueLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Format số tiền thành VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8 bg-blue-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-800">
        Bảng điều khiển quản trị
      </h1>

      {/* Thống kê tổng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tổng người dùng */}
        <div className="bg-purple-100 border-l-4 border-purple-500 rounded-xl shadow p-6">
          <p className="text-purple-700 font-medium">Tổng người dùng</p>
          <p className="text-3xl font-bold text-purple-900">
            {loading ? "Đang tải..." : counts.customerCount}
          </p>
        </div>

        {/* Tổng lượt tư vấn */}
        <div className="bg-green-100 border-l-4 border-green-500 rounded-xl shadow p-6">
          <p className="text-green-700 font-medium">Tổng lượt tư vấn</p>
          <p className="text-3xl font-bold text-green-900">
            {loading ? "Đang tải..." : counts.bookedAvailableSlotCount}
          </p>
        </div>

        {/* Tổng lượt đặt lịch */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow p-6">
          <p className="text-yellow-700 font-medium">Tổng lượt đặt lịch</p>
          <p className="text-3xl font-bold text-yellow-900">
            {loading ? "Đang tải..." : counts.bookedTestSlotCount}
          </p>
        </div>
      </div>

      {/* Thống kê doanh thu */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Thống kê doanh thu</h2>
        
        {revenueLoading ? (
          <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
        ) : revenueData ? (
          <div className="space-y-6">
            {/* Tổng quan doanh thu */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-blue-700 font-medium">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(revenueData.totalRevenue)}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-700 font-medium">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-green-900">
                  {revenueData.totalTransactions}
                </p>
              </div>
              <div className="bg-emerald-100 rounded-lg p-4">
                <p className="text-emerald-700 font-medium">Giao dịch thành công</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {revenueData.successfulTransactions}
                </p>
              </div>
              {/* <div className="bg-red-100 rounded-lg p-4">
                <p className="text-red-700 font-medium">Giao dịch thất bại</p>
                <p className="text-2xl font-bold text-red-900">
                  {revenueData.failedTransactions}
                </p>
              </div> */}
            </div>

            {/* Biểu đồ doanh thu theo dịch vụ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-700 text-lg mb-2">
                  Doanh thu theo dịch vụ
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueData.revenueByService}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalRevenue"
                        nameKey="healthTestName"
                      >
                        {revenueData.revenueByService.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Biểu đồ doanh thu theo tháng */}
              <div>
                <h3 className="font-semibold text-blue-700 text-lg mb-2">
                  Doanh thu theo tháng
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={(month) => `T${month}`} />
                      <YAxis tickFormatter={(value) => `${value / 1000}`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="totalRevenue" fill="#8884d8" name="Doanh thu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Không có dữ liệu doanh thu</p>
        )}
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 justify-end items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-blue-500 text-blue-800 font-medium px-4 py-2 rounded-lg shadow focus:ring focus:ring-blue-300"
        >
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>

        {filter === "month" && (
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-blue-500 text-blue-800 font-medium px-4 py-2 rounded-lg shadow focus:ring focus:ring-blue-300"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        )}

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-blue-500 text-blue-800 font-medium px-4 py-2 rounded-lg shadow focus:ring focus:ring-blue-300"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-blue-700 text-lg mb-2">
            Thống kê Đặt lịch
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartBooking}>
              <Line
                type="monotone"
                dataKey="booking"
                stroke="#2563eb"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-blue-700 text-lg mb-2">
            Thống kê Tư vấn
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartConsultation}>
              <Line
                type="monotone"
                dataKey="consultation"
                stroke="#3b82f6"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
