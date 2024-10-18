import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import ViewBooking from '../../components/ViewBooking/viewBooking';
import Navbar from '../../components/NavBar/NavBar';
import {
  handleGetAllBooking,
  handleUpdateBooking,
} from '../../server/admin/admin';

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
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
          <Sidebar active={active} setActive={setActive} userRole={userRole} />
          <main className="content">
            {bookings ? (
              <ViewBooking
                viewBooking={bookings}
                userId={userId}
                deleteBookingHandler={handleUpdateBooking}
                setViewBooking={setAllBooking}
                type={userRole}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <h3>No Current Booking Is Found. Please Go To View Booking Page</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingPage;
