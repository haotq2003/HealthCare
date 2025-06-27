import React from 'react';

import Homepage from '../src/pages/Guest/Homepage';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/HomePage/MainLayout';
import LoginPage from './pages/Guest/LoginPage';
import RegisterPage from './pages/Guest/RegisterPage';
import ConsultantLayout from './components/Consultant/ConsultantLayout';
import DashboardPage from './pages/Consultant/DashboardPage';
import ProfilePage from './pages/Consultant/ProfilePage';
import SchedulePage from './pages/Consultant/SchedulePage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
           <Route index element={<Homepage/>} />
    <Route path='login' element={<LoginPage/>} />
     <Route path='register' element={<RegisterPage/>} />
      </Route>

       <Route path='/consultant' element={<ConsultantLayout />}>
       <Route path='dashboard' element={<DashboardPage/>} />
        <Route path='profile' element={<ProfilePage/>} />
     <Route path='schedule' element={<SchedulePage/>} />
      </Route>
      
    </Routes>
  );
}

export default App;