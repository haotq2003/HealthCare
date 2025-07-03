import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import ConsultantLayout from "./components/Consultant/ConsultantLayout";
import ManagerLayout from "./components/Manager/ManagerLayout";

// Guest Pages
import HomePage from "./pages/Guest/HomePage/HomePage";
import LoginPage from "./pages/Guest/LoginPage";
import RegisterPage from "./pages/Guest/RegisterPage";

// Consultant Pages
import DashboardPage from "./pages/Consultant/DashboardPage";
import ProfilePage from "./pages/Consultant/ProfilePage";
import SchedulePage from "./pages/Consultant/SchedulePage";

// User Pages
import UserLayout from "./layouts/UserLayout";
import UserHomePage from "./pages/User/UserHomePage";
import UserTestBookingPage from "./pages/User/BookingTest/UserTestBookingPage";
import STIBookingTest from "./pages/User/BookingTest/STIBookingTest";
import UserFAQPage from "./pages/User/UserFAQPage";
import ConsultantListPage from "./pages/User/BookingConsultant/ConsultantListPage";
import ConsultantBookingPage from "./pages/User/BookingConsultant/ConsultantBookingPage";
import ConsultantBookingConfirmPage from "./pages/User/BookingConsultant/ConsultantBookingConfirmPage";
import STIBookingConfirmPage from "./pages/User/BookingTest/STIBookingConfirmPage";
import BlogPage from "./pages/Guest/BlogPage/BlogPage.jsx";
import BlogDetailPage from "./pages/Guest/BlogPage/BlogDetailPage.jsx";
import QuestionsPage from "./pages/Consultant/QuestionsPage.jsx";
import { Toaster } from "react-hot-toast";

// Manager Pages
import BlogManagePage from "./pages/Manager/BlogManagePage.jsx";
import ConsultantManagePage from "./pages/Manager/ConsultantManagePage.jsx";
import ManagerDashboardPage from "./pages/Manager/DashboardPage.jsx";
import FeedbackPage from "./pages/Manager/FeedbackPage.jsx";

function App() {
  return (
    
    <AuthProvider>
     <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="blog" element={<BlogPage/>} />
             <Route path="blog/:id" element={<BlogDetailPage/>} />
        </Route>

        <Route path="/consultant" element={<ConsultantLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="questions" element={<QuestionsPage />} />
        </Route>
        <Route path="/consultant" element={<ConsultantLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="questions" element={<QuestionsPage />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<UserHomePage />} />
          <Route path="booking" element={<ConsultantListPage />} />
          <Route path="booking/:id" element={<ConsultantBookingPage />} />
          <Route path="booking/:id/confirm" element={<ConsultantBookingConfirmPage />} />
          <Route path="test-booking" element={<UserTestBookingPage />} />
          <Route path="test-booking/schedule" element={<STIBookingTest />} />
          <Route path="test-booking/confirm" element={<STIBookingConfirmPage />} />
          <Route path="faq" element={<UserFAQPage />} />
        </Route>

        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="consultants" element={<ConsultantManagePage />} />
          <Route path="blogs" element={<BlogManagePage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
