import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import NewBookingForm from '../../components/NewBookingForm/NewBookingForm';
import Navbar from '../../components/NavBar/NavBar';
const NewBooking = () => {
  const { userId, userRole } = useAuth();

  const [active, setActive] = useState('NewBooking');

  return (
    <>
      <ToastContainer />
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
        <Sidebar active={active} setActive={setActive} userRole={userRole} />
        <main className="content">
          <NewBookingForm userId={userId} />
        </main>
      </div>
      </div>
    </>
  );
};

export default NewBooking;
