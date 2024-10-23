import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import ViewBooking from '../../components/ViewBooking/viewBooking';
import {
  fetchUserBookingInfo,
  fetchUserBookingInfoForDriver,
  deleteBookingHandler,
} from '../../server/booking/booking';
import Navbar from '../../components/NavBar/NavBar';

const ViewBookingPage = () => {
  const { userId, userRole } = useAuth();
  const [viewBooking, setViewBooking] = useState(null);

  const [active, setActive] = useState('MyBookings');

  useEffect(() => {
    const fetchUserData = async () => {
      if (userRole === 'driver') {
        await fetchUserBookingInfoForDriver(userId, setViewBooking);
        return;
      }
      await fetchUserBookingInfo(userId, setViewBooking);
    };
    fetchUserData();
  }, [userId]);
  return (
    <>
      <ToastContainer />
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
          <Sidebar active={active} setActive={setActive} userRole={userRole} />
          <main className="content">
            {viewBooking && (
              <ViewBooking
                viewBooking={viewBooking}
                userId={userId}
                deleteBookingHandler={deleteBookingHandler}
                setViewBooking={setViewBooking}
                type={userRole}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ViewBookingPage;
