// Dashboard.js
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import { getUserLocation } from '../../config/geoLocation';

const Dashboard = () => {
  const { userRole } = useAuth();
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    getUserLocation(setLocation);
  }, [location]);

  useEffect(() => {
    if (userRole === 'user') window.location.href = '/newBooking';
    window.location.href = '/myBookings';
  });
  return <></>;
};

export default Dashboard;
