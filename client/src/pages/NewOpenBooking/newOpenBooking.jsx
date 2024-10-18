import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import { ShowErrorTaskMessage } from '../../utils/logMessge';
import {
  fetchUserAllPendingBookingInfo,
  updateBookingStatus,
} from '../../server/booking/booking';
import { checkProfileStatus } from '../../server/admin/admin';
import ViewNewOpenBooking from '../../components/NewOpenBooking/NewOpenBooking';
import Navbar from '../../components/NavBar/NavBar';

const ViewNewBookingPage = () => {
  const { userId, userRole } = useAuth();
  const [active, setActive] = useState('NewOpenBooking');
  const [bookings, setBookings] = useState(null);
  const [statusProfile, setStatusProfile] = useState(null);
  const [userActive, setUserActive] = useState(false);

  const handleBookingStatus = async () => {
    const currentBooking = localStorage.getItem('currentBooking');

    if (currentBooking) {
      setUserActive(true);
      ShowErrorTaskMessage(
        'You are currently in a live booking. You cannot take another booking at this time.'
      );
      setTimeout(() => {
        window.location.href = '/currentBooking';
      }, 2000);
    } else {
      await checkProfileStatus(userId, setStatusProfile);
      await fetchUserAllPendingBookingInfo(userId, setBookings);
    }
  };
  useEffect(() => {
    handleBookingStatus();
  }, [userActive]);

  return (
    <div>
      <ToastContainer />
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
          <Sidebar
            active={active}
            setActive={setActive}
            userRole={userRole}
            className="hidden lg:block lg:flex-shrink-0 lg:bg-gray-50 lg:border-r lg:border-gray-200 xl:w-64"
          />
          <main className="content">
            {bookings && statusProfile ? (
              <ViewNewOpenBooking
                viewBooking={bookings}
                userId={userId}
                deleteBookingHandler={updateBookingStatus}
                className="px-4 py-6 sm:p-6 xl:p-8"
              />
            ) : (
              <div
                className="flex justify-center items-center h-screen xl:h-full"
                style={{
                  backgroundColor: '#f9fafb',
                }}
              >
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Please Update Your Profile Then You Will Get The Access
                </h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ViewNewBookingPage;
