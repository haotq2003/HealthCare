import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import ConsultantLayout from "./components/Consultant/ConsultantLayout";
import ManagerLayout from "./components/Manager/ManagerLayout";
import StaffLayout from "./layouts/StaffLayout";

// Guest Pages
import HomePage from "./pages/Guest/HomePage/HomePage";
import LoginPage from "./pages/Guest/LoginPage";
import RegisterPage from "./pages/Guest/RegisterPage";

// Consultant Pages
import DashboardPage from "./pages/Consultant/DashboardPage";
import ProfilePage from "./pages/Consultant/ProfilePage";
import ConsultantSchedulePage from "./pages/Consultant/SchedulePage";
import ConsultantRegisterPage from "./pages/Consultant/ConsultantRegisterPage";

// User Pages
import UserLayout from "./layouts/UserLayout";
import UserHomePage from "./pages/User/UserHomePage";
import UserTestBookingPage from "./pages/User/BookingTest/UserTestBookingPage";
import STIBookingTest from "./pages/User/BookingTest/STIBookingTest";
import UserFAQPage from "./pages/User/UserFAQPage";
import UserHistoryPage from "./pages/User/HistoryPage/UserHistoryPage.jsx";
import UserProfilePage from "./pages/User/ProfilePage/UserProfilePage.jsx";
import UserSettingPage from "./pages/User/SettingPage/UserSettingPage.jsx";
import MenstrualPage from "./pages/User/MenstrualPage/MenstrualPage.jsx";
import ConsultantListPage from "./pages/User/BookingConsultant/ConsultantListPage";
import ConsultantBookingPage from "./pages/User/BookingConsultant/ConsultantBookingPage";
import ConsultantBookingConfirmPage from "./pages/User/BookingConsultant/ConsultantBookingConfirmPage";
import STIBookingConfirmPage from "./pages/User/BookingTest/STIBookingConfirmPage";
import BlogPage from "./pages/Guest/BlogPage/BlogPage.jsx";
import BlogDetailPage from "./pages/Guest/BlogPage/BlogDetailPage.jsx";
import QuestionsPage from "./pages/Consultant/QuestionsPage.jsx";
import { Toaster } from "react-hot-toast";
import DashboardPageUser from "./pages/User/DashboardPage.jsx";

// Manager Pages
import BlogManagePage from "./pages/Manager/BlogManagePage.jsx";
import ConsultantManagePage from "./pages/Manager/ConsultantManagePage.jsx";
import ManagerDashboardPage from "./pages/Manager/DashboardPage.jsx";
import FeedbackPage from "./pages/Manager/FeedbackPage.jsx";
import ConsultationPage from "./pages/Consultant/ConsultationPage.jsx";

// Staff Pages
import DashboardPageStaff from "./pages/Staff/DashboardPageStaff.jsx";
import TestScheduleManagePage from "./pages/Staff/TestScheduleManagePage.jsx";
import TestPackageManagePage from "./pages/Staff/TestPackageManagePage.jsx";
import PackagePage from "./pages/Staff/PackagePage";
import StaffSchedulePage from "./pages/Staff/SchedulePage";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import PaymentSuccessPage from "./pages/User/BookingTest/PaymentSuccessPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.jsx";
import UserPage from "./pages/Admin/UserPage.jsx";
import AdminProfilePage from "./pages/Admin/AdminProfilePage.jsx";
import AcceptDoctor from "./pages/Admin/AcceptDoctor.jsx";
import ConsultantCreateProfile from "./pages/Consultant/ConsultantCreateProfile.jsx";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route
            path="/consultant/register"
            element={<ConsultantRegisterPage />}
          />
        </Route>

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<PackagePage />} />
          <Route path="packages" element={<PackagePage />} />
          <Route path="schedule" element={<StaffSchedulePage />} />
        </Route>

        <Route path="/consultant" element={<ConsultantLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* <Route path="profile" element={<ProfilePage />} /> */}
          <Route path="schedule" element={<ConsultantSchedulePage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="consultation" element={<ConsultationPage />} />
          <Route path="create-profile" element={<ConsultantCreateProfile />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<UserHomePage />} />
          <Route path="dashboard" element={<DashboardPageUser />} />
          <Route path="booking" element={<ConsultantListPage />} />
          <Route path="booking/:id" element={<ConsultantBookingPage />} />
          <Route
            path="booking/:id/confirm"
            element={<ConsultantBookingConfirmPage />}
          />
          <Route path="test-booking" element={<UserTestBookingPage />} />
          <Route path="test-booking/schedule" element={<STIBookingTest />} />
          <Route
            path="test-booking/confirm"
            element={<STIBookingConfirmPage />}
          />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="faq" element={<UserFAQPage />} />
          <Route path="history" element={<UserHistoryPage />} />
          <Route path="menstrual-cycle" element={<MenstrualPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="setting" element={<UserSettingPage />} />
        </Route>

        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="consultants" element={<ConsultantManagePage />} />
          <Route path="blogs" element={<BlogManagePage />} />
          <Route path="feedback" element={<FeedbackPage />} />

        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserPage />} />
          {/* <Route path="bookings" element={<AdminBookingPage />} /> */}
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="accept-doctor" element={<AcceptDoctor />} />
        </Route>
      </Routes>
      <ChatWidget />
    </AuthProvider>
  );
}

export default App;
