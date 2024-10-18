import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewBookingForm from './pages/NewBooking/newBooking';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/dashboard';
import NotFound from './pages/NotFound/notFound';
import Profile from './pages/Profile/Profile';
import ManageUser from './pages/ManageUser/manageUser';
import ManageDriver from './pages/ManageDriver/manageDriver';
import ViewBooking from './pages/ViewBooking/viewBooking';
import Analytics from './pages/Analytics/analytics';
import ViewBookingManage from './pages/ViewBookingManage/viewBookingManage';
import { AuthProvider } from './hooks/isAuth/isAuth';
import CurrentBooking from './pages/CurrentBooking/currentBooking';
import NewOpenBooking from './pages/NewOpenBooking/newOpenBooking';
import './index.css'; 

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Common Router */}
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* user role is user */}
          <Route path="/newBooking" element={<NewBookingForm />} />
          <Route path="/myBookings" element={<ViewBooking />} />
          {/* user role is admin  */}
          <Route path="/manageUsers" element={<ManageUser />} />
          <Route path="/manageDrivers" element={<ManageDriver />} />
          <Route path="/viewBookings" element={<ViewBookingManage />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* user role is driver */}
          <Route path="/newOpenBooking" element={<NewOpenBooking />} />
          <Route path="/currentBooking" element={<CurrentBooking />} />

          {/* not found router  */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
