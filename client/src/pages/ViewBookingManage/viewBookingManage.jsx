import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import ViewBooking from '../../components/ViewBooking/viewBooking';
import {
  handleGetAllBooking,
  handleUpdateBooking,
} from '../../server/admin/admin';
import { updateBookingStatus } from '../../server/booking/booking';
import Navbar from '../../components/NavBar/NavBar';

const ViewBookingPage = () => {
  const { userId, userRole } = useAuth();
  const [bookings, setAllBooking] = useState(null);

  const [active, setActive] = useState('ViewBookings');

  useEffect(() => {
    const fetchUserData = async () => {
      await handleGetAllBooking(setAllBooking);
    };
    fetchUserData();
  }, []);
  return (
    <div>
      <ToastContainer />
      {/* <div className="dashboard-container"> */}
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
          <Sidebar active={active} setActive={setActive} userRole={userRole} />
          {/* <Navbar /> */}
          <main className="content">
            {bookings && (
              <ViewBooking
                viewBooking={bookings}
                deleteBookingHandler={handleUpdateBooking}
                updateBookingStatusHandler={updateBookingStatus}
                userId={userId}
                setViewBooking={setAllBooking}
                type={userRole}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingPage;
