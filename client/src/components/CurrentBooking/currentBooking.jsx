import React from 'react';
import styles from '../profileDiv/profileDiv.module.css';

export default function CurrentBookingDiv({
  booking,
  userId,
  userRole,
  currentUser,
  handleCompleteTour,
}) {
  return (
    <div className={styles.profileDiv}>
      <h1>Current Booking</h1>
      <hr style={{ backgroundColor: 'grey', width: '100%', height: '1px' }} />
      <div className={styles.completediv}>
        <div className={styles.groupformDiv}>
          <div className={styles.formdiv}>
            <label style={{ fontWeight: 'bold' }}>Pick-up-Location:</label>
            <input
              type="text"
              value={booking.pickupLocation}
              readOnly
              className={styles.inputField}
            />
          </div>
          <div className={styles.formdiv} style={{ marginRight: '2vh' }}>
            <label style={{ fontWeight: 'bold' }}>Drop-Location:</label>
            <input
              type="email"
              value={booking.dropOffLocation}
              readOnly
              style={{ width: '270px' }}
            />
          </div>
        </div>
        <br />
        <div className={styles.groupformDiv}>
          <div className={styles.formdiv}>
            <label style={{ fontWeight: 'bold' }}>estimatedCost:</label>
            <input type="text" name="fullName" value={booking.estimatedCost} />
          </div>
        </div>
        <br />
        <h2>{userRole === 'user' ? 'Drive Details' : 'Customer Details'}</h2>
        <div className={styles.groupformDiv}>
          <div className={styles.formdiv}>
            <label style={{ fontWeight: 'bold' }}>Full Name:</label>
            <input
              type="text"
              name="phoneNumber"
              value={currentUser.fullName}
            />
          </div>
          <div className={styles.formdiv}>
            <label style={{ fontWeight: 'bold' }}>PhoneNumber:</label>
            <input
              type="text"
              name="phoneNumber"
              value={currentUser.phoneNumber}
            />
          </div>
        </div>
        <br />
        {userRole === 'driver' && (
          <button
            type="submit"
            style={{ margin: 'auto' }}
            onClick={() => {
              handleCompleteTour(booking._id, userId);
            }}
          >
            Complete Tour
          </button>
        )}
      </div>
    </div>
  );
}
