import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white-900 text-white flex justify-between items-center p-4">
      <div className="flex items-center">
        <Link to="/">
          <img
            src="./assets/atlan_logo.png"
            alt="Atlan Logo"
            className="h-8 w-auto mr-2" // Adjust height to fit your design
          />
        </Link>
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex bg-white hover:bg-cyan-300 items-center focus:outline-none"
        >
          <img
            src="./assets/icon.png"
            alt="Profile"
            className="h-10 w-auto"
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-20">
            <ul className="py-1">
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
