import React, { useState, useEffect } from 'react';
import { handleProfileUpdatedSubmit } from '../../server/profile/profile';
import styles from './profileDiv.module.css';
import { ShowErrorTaskMessage } from '../../utils/logMessge';

export default function ProfileDiv({ userInfoBase, userId }) {
  const [userInfo, setUserInfo] = useState(userInfoBase);
  const [isModified, setIsModified] = useState(false);
  const vehicleTypes = ['Car', 'Auto', 'Bus', 'Taxi', 'Truck', 'MiniVan'];
  useEffect(() => {
    if (userInfo.image && userInfo.image.data.data) {
      const base64String = userInfo.image.data.data.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        ''
      );
      const imageSrc = `data:${userInfo.image.contentType};base64,${btoa(base64String)}`;
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        image: {
          ...prevInfo.image,
          data: imageSrc,
        },
      }));
    }
  }, [userInfo.image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleImageUpload = () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';

    inputFile.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            image: {
              file: file,
              data: reader.result,
            },
          }));
          setIsModified(true);
        };
        reader.readAsDataURL(file);
      }
    };
    inputFile.click();
  };

  return (
    <div className={styles.profileDiv}>
      <h1>User Profile</h1>
      <hr style={{ backgroundColor: 'grey', width: '100%', height: '1px' }} />
      <div className={styles.imageUpload}>
        {!userInfo.image && (
          <span style={{ cursor: 'pointer' }} onClick={handleImageUpload}>
            Upload Image
          </span>
        )}
        {userInfo.image && (
          <img
            src={userInfo.image.data}
            alt="Uploaded"
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        )}
      </div>
      {userInfo.image && (
        <button type="button" onClick={handleImageUpload}>
          Change Image
        </button>
      )}
      <form
        style={{ width: '100%' }}
        onSubmit={(e) => {
          handleProfileUpdatedSubmit(e, userId, userInfo, setIsModified);
        }}
      >
        <div className={styles.completediv}>
          <div className={styles.groupformDiv}>
            <div className={styles.formdiv}>
              <label style={{ fontWeight: 'bold' }}>Username:</label>
              <input
                type="text"
                value={userInfo.username}
                readOnly
                className={styles.inputField}
                onClick={() => {
                  ShowErrorTaskMessage('Username cannot be modified');
                }}
              />
            </div>
            <div className={styles.formdiv} style={{ marginRight: '2vh' }}>
              <label style={{ fontWeight: 'bold' }}>Email:</label>
              <input
                type="email"
                value={userInfo.userEmail}
                readOnly
                style={{ width: '270px' }}
                onClick={() => {
                  ShowErrorTaskMessage('Email cannot be modified');
                }}
              />
            </div>
          </div>
          <div className={styles.groupformDiv}>
            <div className={styles.formdiv}>
              <label style={{ fontWeight: 'bold' }}>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={userInfo.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formdiv}>
              <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {userInfo.userRole === 'driver' && (
            <div className={styles.groupformDiv}>
              <div className={styles.formdiv}>
                <label style={{ fontWeight: 'bold' }}>Vehicle Type:</label>
                <select
                  name="vehicleType"
                  className={styles.selectOptionType}
                  style={{ width: '210px' }}
                  value={userInfo.vehicleType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select vehicle type
                  </option>
                  {vehicleTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formdiv}>
                <label style={{ fontWeight: 'bold' }}>Vehicle Number:</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={userInfo.vehicleNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}
          {userInfo.userRole === 'driver' && (
            <div className={styles.groupformDiv}>
              <div className={styles.formdiv}>
                <label style={{ fontWeight: 'bold' }}>Total Earnings:</label>
                <input
                  name="vehicleType"
                  style={{ width: '210px' }}
                  value={`${userInfo.earnedMoney} Rs`}
                  readOnly
                  onClick={() => {
                    ShowErrorTaskMessage('Total Earned is Not Modify');
                  }}
                />
              </div>
            </div>
          )}
          {isModified && (
            <button type="submit" style={{ margin: 'auto' }}>
              Update Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
