import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import ConsultantLayout from "./components/Consultant/ConsultantLayout";

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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/consultant" element={<ConsultantLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="schedule" element={<SchedulePage />} />
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
      </Routes>
    </AuthProvider>
  );
}

export default App;
