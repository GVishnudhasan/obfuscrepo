import { REACT_APP_API_URL, axiosInstance } from '../../parameter/parameter';
import {
  ShowErrorMessage,
  ShowSuccessMessage,
} from '../../utils/logMessge';

// Generic function to handle GET requests
const fetchData = async (url, setData) => {
  try {
    const response = await axiosInstance.get(url);
    setData(response.data);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

// Generic function to handle DELETE requests
const updateData = async (url, data, setAllData, fetchFunction) => {
  try {
    const response = await axiosInstance.post(url, data);
    ShowSuccessMessage(response.data.message);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    await fetchFunction(setAllData);
  }
};

// Function to get all users
export const handleGetAllUser = (setAllUser) => {
  fetchData(`${REACT_APP_API_URL}/api/admin/get_users`, setAllUser);
};

// Function to get all drivers
export const handleGetAllDriver = (setAllDrive) => {
  fetchData(`${REACT_APP_API_URL}/api/admin/get_driver`, setAllDrive);
};

// Function to get all bookings
export const handleGetAllBooking = (setAllBooking) => {
  fetchData(`${REACT_APP_API_URL}/api/admin/get_booking`, setAllBooking);
};

// Function to update (delete) user
export const handleUpdateUser = (userId, setAllUser) => {
  updateData(
    `${REACT_APP_API_URL}/api/admin/delete_users`,
    { userId },
    setAllUser,
    handleGetAllUser
  );
};

// Function to update (delete) driver
export const handleUpdateDriver = (userId, setAllDrive) => {
  updateData(
    `${REACT_APP_API_URL}/api/admin/delete_driver`,
    { userId },
    setAllDrive,
    handleGetAllDriver
  );
};

// Function to update (delete) booking
export const handleUpdateBooking = async (bookingId, setAllBooking) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/admin/delete_booking`,
      { bookingId }
    );
    ShowSuccessMessage(response.data.message);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    window.location.reload();
  }
};

export const getAnalytics = async (
  setUserCount,
  setDriverCount,
  setBookings
) => {
  try {
    const response = await axiosInstance.get(
      `${REACT_APP_API_URL}/api/admin/get_analytics`
    );
    setBookings(response.data.bookings);
    setUserCount(response.data.userLength);
    setDriverCount(response.data.driverLength);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

export const checkProfileStatus = async (userId, setStatusProfile) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/admin/check_profile_status`,
      { userId }
    );
    setStatusProfile(response.data.status);
  } catch (error) {
    ShowErrorMessage(error);
  }
};
