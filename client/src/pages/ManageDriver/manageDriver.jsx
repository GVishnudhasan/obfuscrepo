import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/isAuth/isAuth';
import Sidebar from '../../components/sidebar/SideBar';
import ManageUserDiv from '../../components/ManageUser/manageUser';
import {
  handleGetAllDriver,
  handleUpdateDriver,
} from '../../server/admin/admin';
import Navbar from '../../components/NavBar/NavBar';

const ViewBookingPage = () => {
  const { userId, userRole } = useAuth();
  const [drivers, setAlldrivers] = useState(null);

  const [active, setActive] = useState('ManageDrivers');

  useEffect(() => {
    const fetchUserData = async () => {
      await handleGetAllDriver(setAlldrivers);
      console.log(userId);
    };

    fetchUserData();
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="dashboard-container flex flex-col">
        <Navbar />
        <div className="dashboard-content flex flex-row">
        <Sidebar active={active} setActive={setActive} userRole={userRole} />
        <main className="content">
          {drivers && (
            <ManageUserDiv
              users={drivers}
              title="My Drivers"
              subtitle="Driver"
              handleUpdateUser={handleUpdateDriver}
              setAllUsers={setAlldrivers}
            />
          )}
        </main>
      </div>
      </div>
    </>
  );
};

export default ViewBookingPage;
