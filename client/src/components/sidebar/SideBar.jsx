import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ active, setActive, userRole }) => {
  return (
    <aside className="sidebar">
      <ul>
        {userRole === 'user' && (
          <>
            <Link to="/myBookings">
              <li
                className={active === 'MyBookings' ? 'active' : ''}
                onClick={() => setActive('MyBookings')}
              >
                <span className="material-symbols-outlined">folder_open</span>{' '}
                My Bookings
              </li>
            </Link>
            {/* <Link to="/currentBooking">
              <li
                className={active === 'CurrentBooking' ? 'active' : ''}
                onClick={() => setActive('CurrentBooking')}
              >
                <span className="material-symbols-outlined">check_circle</span>{' '}
                Current Booking
              </li>
            </Link> */}
            <Link to="/newBooking">
              <li
                className={active === 'NewBooking' ? 'active' : ''}
                onClick={() => setActive('NewBooking')}
              >
                <span className="material-symbols-outlined">add_task</span> New
                Booking
              </li>
            </Link>
          </>
        )}

        {userRole === 'driver' && (
          <>
            <Link to="/newOpenBooking">
              <li
                className={active === 'NewOpenBooking' ? 'active' : ''}
                onClick={() => setActive('NewOpenBooking')}
              >
                <span className="material-symbols-outlined">add_task</span> View Open
                Booking
              </li>
            </Link>
            {/* <Link to="/currentBooking">
              <li
                className={active === 'CurrentBooking' ? 'active' : ''}
                onClick={() => setActive('CurrentBooking')}
              >
                <span className="material-symbols-outlined">check_circle</span>{' '}
                Current Booking
              </li>
            </Link> */}
            <Link to="/myBookings">
              <li
                className={active === 'MyBookings' ? 'active' : ''}
                onClick={() => setActive('MyBookings')}
              >
                <span className="material-symbols-outlined">folder_open</span>{' '}
                My Bookings
              </li>
            </Link>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <Link to="/manageUsers">
              <li
                className={active === 'ManageUsers' ? 'active' : ''}
                onClick={() => setActive('ManageUsers')}
              >
                <span className="material-symbols-outlined">people</span> Manage
                Users
              </li>
            </Link>
            <Link to="/manageDrivers">
              <li
                className={active === 'ManageDrivers' ? 'active' : ''}
                onClick={() => setActive('ManageDrivers')}
              >
                <span className="material-symbols-outlined">
                  directions_car
                </span>{' '}
                Manage Drivers
              </li>
            </Link>
            <Link to="/viewBookings">
              <li
                className={active === 'ViewBookings' ? 'active' : ''}
                onClick={() => setActive('ViewBookings')}
              >
                <span className="material-symbols-outlined">receipt_long</span>{' '}
                View Bookings
              </li>
            </Link>
            <Link to="/analytics">
              <li
                className={active === 'Analytics' ? 'active' : ''}
                onClick={() => setActive('Analytics')}
              >
                <span className="material-symbols-outlined">assessment</span>{' '}
                Analytics
              </li>
            </Link>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
