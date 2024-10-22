import { REACT_APP_API_URL, axiosInstance } from '../../parameter/parameter';

import {
  ShowErrorMessage,
  ShowSuccessMessage,
  ShowErrorTaskMessage,
} from '../../utils/logMessge';

// Function To booking form
export const handleBookingSubmit = async (
  e,
  formData,
  clearData,
  estimatedCost,
  userId
) => {
  e.preventDefault();
  const currentDate = new Date();
  const currentDateParts = currentDate.toLocaleString().split(',');
  const currentTimeParts = currentDateParts[1].split(':');
  const currentTime = new Date(
    currentDate.setHours(currentTimeParts[0], currentTimeParts[1])
  );
  const inputDate = new Date();
  const inputTimeParts = formData.time.split(':');
  const inputTime = new Date(
    inputDate.setHours(inputTimeParts[0], inputTimeParts[1])
  );

  if (isNaN(inputDate.getTime()) || isNaN(inputTime.getTime())) {
    ShowErrorTaskMessage('Please enter a valid date and time.');
    return;
  }

  if (formData.pickupLocation === formData.dropOffLocation) {
    ShowErrorTaskMessage('Pickup and drop-off locations must be different.');
    return;
  }

  if (inputTime <= currentTime) {
    console.log(currentTime, inputTime);

    ShowErrorTaskMessage(
      'The date and time must be greater than the current time.'
    );
    return;
  }

  const formDataSend = {
    pickupLocation: formData.pickupLocation,
    dropOffLocation: formData.dropOffLocation,
    date: formData.date,
    time: formData.time,
    vehicleType: formData.vehicleType,
    estimatedCost: estimatedCost,
    userId: userId,
  };
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking`,
      formDataSend
    );
    ShowSuccessMessage(response.data.message);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    clearData();
  }
};

export const fetchUserBookingInfo = async (userId, setViewBooking) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/viewBooking`,
      { userId }
    );
    setViewBooking(response.data.bookings);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

export const deleteBookingHandler = async (
  bookingId,
  userId,
  setViewBooking
) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/DeleteBooking`,
      { bookingId }
    );
    ShowSuccessMessage(response.data.message);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    await fetchUserBookingInfo(userId, setViewBooking);
  }
};

export const fetchUserAllPendingBookingInfo = async (
  userId,
  setViewBooking
) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/viewOpenBooking`,
      { userId }
    );
    setViewBooking(response.data);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

export const updateBookingStatus = async (bookingId, userId, newStatus) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/updateBookingStatus`,
      { bookingId, userId, newStatus }
    );
    ShowSuccessMessage(response.data.message);
    setTimeout(() => {
      window.location.href = '/currentBooking';
    }, 500);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    window.location.reload();
  }
};

export const gettingCurrentBooking = async (
  userId,
  userRole,
  setCurrentBooking,
  setCurrentUser
) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/gettingCurrentBooking`,
      { userRole, userId }
    );
    setCurrentBooking(response.data.currentBooking);
    setCurrentUser(response.data.currentUser);
    localStorage.setItem('currentBooking', true);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

export const handleCompleteTour = async (bookingId, userId) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/booking/handleCompleteTour`,
      { bookingId, userId }
    );
    localStorage.removeItem('currentBooking');
    ShowSuccessMessage(response.data.message);
    setTimeout(() => {
      window.location.href = '/newOpenBooking';
    }, 500);
  } catch (error) {
    ShowErrorMessage(error);
  }
};
