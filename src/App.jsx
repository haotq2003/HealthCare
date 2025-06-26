import React from 'react';

import Homepage from '../src/pages/Guest/Homepage';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/HomePage/MainLayout';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
           <Route index element={<Homepage/>} />

      </Route>
    </Routes>
  );
}

export default App;