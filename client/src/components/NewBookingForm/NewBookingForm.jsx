import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleBookingSubmit } from '../../server/booking/booking';
import styles from './NewBookingForm.module.css';

const locations = [
  'Koramangala',
  'Indiranagar',
  'MG Road',
  'Brigade Road',
  'Jayanagar',
  'Whitefield',
  'HSR Layout',
  'Bangalore East',
  'Bangalore South',
  'Malleshwaram',
  'Sadashivanagar',
  'RT Nagar',
  'Basavanagudi',
  'Ulsoor',
  'BTM Layout',
  'Kengeri',
  'Yelahanka',
  'Marathahalli',
  'Sarjapur',
  'Vijayanagar',
];

const vehicleTypes = ['Car', 'Auto', 'Bus', 'Taxi', 'Truck', 'MiniVan'];

const costEstimates = {
  Car: 50,
  Auto: 30,
  Bus: 20,
  Taxi: 40,
  Truck: 60,
  MiniVan: 70,
  
};

const distanceMatrix = {
  Koramangala: {
    Indiranagar: 4,
    'MG Road': 5,
    'Brigade Road': 6,
    Jayanagar: 7,
    Whitefield: 12,
    'HSR Layout': 3,
    'Bangalore East': 9,
    'Bangalore South': 8,
    Malleshwaram: 10,
    Sadashivanagar: 11,
    'RT Nagar': 7,
    Basavanagudi: 6,
    Ulsoor: 8,
    'BTM Layout': 4,
    Kengeri: 15,
    Yelahanka: 18,
    Marathahalli: 12,
    Sarjapur: 10,
    Vijayanagar: 9,
  },
  Indiranagar: {
    Koramangala: 4,
    'MG Road': 3,
    'Brigade Road': 4,
    Jayanagar: 6,
    Whitefield: 8,
    'HSR Layout': 5,
    'Bangalore East': 6,
    'Bangalore South': 7,
    Malleshwaram: 8,
    Sadashivanagar: 9,
    'RT Nagar': 5,
    Basavanagudi: 8,
    Ulsoor: 2,
    'BTM Layout': 5,
    Kengeri: 14,
    Yelahanka: 17,
    Marathahalli: 9,
    Sarjapur: 12,
    Vijayanagar: 8,
  },
  'MG Road': {
    Koramangala: 5,
    Indiranagar: 3,
    'Brigade Road': 1,
    Jayanagar: 7,
    Whitefield: 10,
    'HSR Layout': 6,
    'Bangalore East': 8,
    'Bangalore South': 5,
    Malleshwaram: 7,
    Sadashivanagar: 8,
    'RT Nagar': 7,
    Basavanagudi: 6,
    Ulsoor: 4,
    'BTM Layout': 5,
    Kengeri: 13,
    Yelahanka: 16,
    Marathahalli: 11,
    Sarjapur: 12,
    Vijayanagar: 6,
  },
  'Brigade Road': {
    Koramangala: 6,
    Indiranagar: 4,
    'MG Road': 1,
    Jayanagar: 6,
    Whitefield: 10,
    'HSR Layout': 6,
    'Bangalore East': 8,
    'Bangalore South': 6,
    Malleshwaram: 6,
    Sadashivanagar: 7,
    'RT Nagar': 6,
    Basavanagudi: 7,
    Ulsoor: 5,
    'BTM Layout': 7,
    Kengeri: 14,
    Yelahanka: 16,
    Marathahalli: 12,
    Sarjapur: 13,
    Vijayanagar: 7,
  },
  Jayanagar: {
    Koramangala: 7,
    Indiranagar: 6,
    'MG Road': 7,
    'Brigade Road': 6,
    Whitefield: 12,
    'HSR Layout': 4,
    'Bangalore East': 10,
    'Bangalore South': 5,
    Malleshwaram: 8,
    Sadashivanagar: 9,
    'RT Nagar': 8,
    Basavanagudi: 3,
    Ulsoor: 8,
    'BTM Layout': 6,
    Kengeri: 11,
    Yelahanka: 15,
    Marathahalli: 11,
    Sarjapur: 9,
    Vijayanagar: 7,
  },
  Whitefield: {
    Koramangala: 12,
    Indiranagar: 8,
    'MG Road': 10,
    'Brigade Road': 10,
    Jayanagar: 12,
    'HSR Layout': 8,
    'Bangalore East': 6,
    'Bangalore South': 14,
    Malleshwaram: 12,
    Sadashivanagar: 14,
    'RT Nagar': 10,
    Basavanagudi: 13,
    Ulsoor: 10,
    'BTM Layout': 12,
    Kengeri: 20,
    Yelahanka: 10,
    Marathahalli: 5,
    Sarjapur: 9,
    Vijayanagar: 15,
  },
  'HSR Layout': {
    Koramangala: 3,
    Indiranagar: 5,
    'MG Road': 6,
    'Brigade Road': 6,
    Jayanagar: 4,
    Whitefield: 8,
    'Bangalore East': 9,
    'Bangalore South': 7,
    Malleshwaram: 9,
    Sadashivanagar: 10,
    'RT Nagar': 6,
    Basavanagudi: 6,
    Ulsoor: 7,
    'BTM Layout': 3,
    Kengeri: 14,
    Yelahanka: 17,
    Marathahalli: 10,
    Sarjapur: 5,
    Vijayanagar: 7,
  },
  'Bangalore East': {
    Koramangala: 9,
    Indiranagar: 6,
    'MG Road': 8,
    'Brigade Road': 8,
    Jayanagar: 10,
    Whitefield: 6,
    'HSR Layout': 9,
    'Bangalore South': 10,
    Malleshwaram: 12,
    Sadashivanagar: 11,
    'RT Nagar': 9,
    Basavanagudi: 10,
    Ulsoor: 8,
    'BTM Layout': 7,
    Kengeri: 13,
    Yelahanka: 12,
    Marathahalli: 9,
    Sarjapur: 14,
    Vijayanagar: 11,
  },
  'Bangalore South': {
    Koramangala: 8,
    Indiranagar: 7,
    'MG Road': 5,
    'Brigade Road': 6,
    Jayanagar: 5,
    Whitefield: 14,
    'HSR Layout': 7,
    'Bangalore East': 10,
    Malleshwaram: 8,
    Sadashivanagar: 9,
    'RT Nagar': 7,
    Basavanagudi: 4,
    Ulsoor: 8,
    'BTM Layout': 5,
    Kengeri: 12,
    Yelahanka: 17,
    Marathahalli: 10,
    Sarjapur: 12,
    Vijayanagar: 7,
  },
  Malleshwaram: {
    Koramangala: 10,
    Indiranagar: 8,
    'MG Road': 7,
    'Brigade Road': 6,
    Jayanagar: 8,
    Whitefield: 12,
    'HSR Layout': 9,
    'Bangalore East': 12,
    'Bangalore South': 8,
    Sadashivanagar: 8,
    'RT Nagar': 8,
    Basavanagudi: 9,
    Ulsoor: 8,
    'BTM Layout': 9,
    Kengeri: 15,
    Yelahanka: 20,
    Marathahalli: 11,
    Sarjapur: 14,
    Vijayanagar: 10,
  },
  Sadashivanagar: {
    Koramangala: 11,
    Indiranagar: 9,
    'MG Road': 8,
    'Brigade Road': 7,
    Jayanagar: 9,
    Whitefield: 14,
    'HSR Layout': 10,
    'Bangalore East': 11,
    'Bangalore South': 9,
    Malleshwaram: 8,
    'RT Nagar': 10,
    Basavanagudi: 8,
    Ulsoor: 9,
    'BTM Layout': 10,
    Kengeri: 16,
    Yelahanka: 19,
    Marathahalli: 12,
    Sarjapur: 14,
    Vijayanagar: 11,
  },
  'RT Nagar': {
    Koramangala: 7,
    Indiranagar: 5,
    'MG Road': 7,
    'Brigade Road': 6,
    Jayanagar: 8,
    Whitefield: 10,
    'HSR Layout': 6,
    'Bangalore East': 9,
    'Bangalore South': 7,
    Malleshwaram: 8,
    Sadashivanagar: 10,
    Basavanagudi: 6,
    Ulsoor: 7,
    'BTM Layout': 6,
    Kengeri: 15,
    Yelahanka: 18,
    Marathahalli: 10,
    Sarjapur: 9,
    Vijayanagar: 7,
  },
  Basavanagudi: {
    Koramangala: 6,
    Indiranagar: 8,
    'MG Road': 6,
    'Brigade Road': 7,
    Jayanagar: 3,
    Whitefield: 12,
    'HSR Layout': 6,
    'Bangalore East': 10,
    'Bangalore South': 4,
    Malleshwaram: 9,
    Sadashivanagar: 8,
    'RT Nagar': 6,
    Ulsoor: 7,
    'BTM Layout': 5,
    Kengeri: 13,
    Yelahanka: 16,
    Marathahalli: 9,
    Sarjapur: 10,
    Vijayanagar: 6,
  },
  Ulsoor: {
    Koramangala: 8,
    Indiranagar: 2,
    'MG Road': 4,
    'Brigade Road': 5,
    Jayanagar: 8,
    Whitefield: 10,
    'HSR Layout': 7,
    'Bangalore East': 8,
    'Bangalore South': 8,
    Malleshwaram: 8,
    Sadashivanagar: 9,
    'RT Nagar': 7,
    Basavanagudi: 7,
    'BTM Layout': 5,
    Kengeri: 14,
    Yelahanka: 17,
    Marathahalli: 9,
    Sarjapur: 11,
    Vijayanagar: 9,
  },
  'BTM Layout': {
    Koramangala: 4,
    Indiranagar: 5,
    'MG Road': 5,
    'Brigade Road': 7,
    Jayanagar: 6,
    Whitefield: 12,
    'HSR Layout': 3,
    'Bangalore East': 7,
    'Bangalore South': 5,
    Malleshwaram: 9,
    Sadashivanagar: 10,
    'RT Nagar': 6,
    Basavanagudi: 5,
    Ulsoor: 5,
    Kengeri: 14,
    Yelahanka: 16,
    Marathahalli: 11,
    Sarjapur: 8,
    Vijayanagar: 7,
  },
  Kengeri: {
    Koramangala: 15,
    Indiranagar: 14,
    'MG Road': 13,
    'Brigade Road': 14,
    Jayanagar: 11,
    Whitefield: 20,
    'HSR Layout': 14,
    'Bangalore East': 13,
    'Bangalore South': 12,
    Malleshwaram: 15,
    Sadashivanagar: 16,
    'RT Nagar': 15,
    Basavanagudi: 13,
    Ulsoor: 14,
    'BTM Layout': 14,
    Yelahanka: 12,
    Marathahalli: 11,
    Sarjapur: 20,
    Vijayanagar: 15,
  },
  Yelahanka: {
    Koramangala: 18,
    Indiranagar: 17,
    'MG Road': 16,
    'Brigade Road': 16,
    Jayanagar: 15,
    Whitefield: 10,
    'HSR Layout': 17,
    'Bangalore East': 12,
    'Bangalore South': 17,
    Malleshwaram: 20,
    Sadashivanagar: 19,
    'RT Nagar': 18,
    Basavanagudi: 16,
    Ulsoor: 17,
    'BTM Layout': 16,
    Kengeri: 12,
    Marathahalli: 10,
    Sarjapur: 14,
    Vijayanagar: 18,
  },
  Marathahalli: {
    Koramangala: 12,
    Indiranagar: 9,
    'MG Road': 11,
    'Brigade Road': 12,
    Jayanagar: 11,
    Whitefield: 5,
    'HSR Layout': 10,
    'Bangalore East': 9,
    'Bangalore South': 10,
    Malleshwaram: 11,
    Sadashivanagar: 12,
    'RT Nagar': 10,
    Basavanagudi: 9,
    Ulsoor: 9,
    'BTM Layout': 11,
    Kengeri: 20,
    Yelahanka: 14,
    Sarjapur: 10,
    Vijayanagar: 11,
  },
  Sarjapur: {
    Koramangala: 10,
    Indiranagar: 12,
    'MG Road': 12,
    'Brigade Road': 13,
    Jayanagar: 9,
    Whitefield: 9,
    'HSR Layout': 5,
    'Bangalore East': 14,
    'Bangalore South': 12,
    Malleshwaram: 14,
    Sadashivanagar: 14,
    'RT Nagar': 9,
    Basavanagudi: 10,
    Ulsoor: 11,
    'BTM Layout': 8,
    Kengeri: 20,
    Yelahanka: 14,
    Marathahalli: 10,
    Vijayanagar: 12,
  },
  Vijayanagar: {
    Koramangala: 9,
    Indiranagar: 8,
    'MG Road': 6,
    'Brigade Road': 7,
    Jayanagar: 7,
    Whitefield: 15,
    'HSR Layout': 7,
    'Bangalore East': 11,
    'Bangalore South': 7,
    Malleshwaram: 10,
    Sadashivanagar: 11,
    'RT Nagar': 7,
    Basavanagudi: 6,
    Ulsoor: 9,
    'BTM Layout': 7,
    Kengeri: 15,
    Yelahanka: 18,
    Marathahalli: 11,
    Sarjapur: 12,
    Vijayanagar: 9,
  },
};

const NewBookingForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropOffLocation: '',
    date: '',
    time: '',
    vehicleType: '',
  });

  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (
      name === 'pickupLocation' ||
      name === 'dropOffLocation' ||
      name === 'vehicleType'
    ) {
      calculateEstimatedCost(
        formData.pickupLocation,
        formData.dropOffLocation,
        value
      );
    }
  };

  const clearData = () => {
    setFormData({
      pickupLocation: '',
      dropOffLocation: '',
      date: '',
      time: '',
      vehicleType: '',
    });
    setEstimatedCost(0);
  };
  const calculateEstimatedCost = (pickup, dropOff, vehicle) => {
    if (pickup && dropOff && vehicle) {
      const distance = distanceMatrix[pickup]?.[dropOff] || 0;
      const vehicleCost = costEstimates[vehicle] || 0;
      const cost = distance * vehicleCost;
      setEstimatedCost(cost);
    } else {
      setEstimatedCost(0);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prevData) => ({
      ...prevData,
      date: today,
    }));
    calculateEstimatedCost(
      formData.pickupLocation,
      formData.dropOffLocation,
      formData.vehicleType
    );
  }, [formData]);

  return (
    <form
      onSubmit={(e) => {
        handleBookingSubmit(e, formData, clearData, estimatedCost, userId);
      }}
      className={styles.newBookingForm}
    >
      <ToastContainer />
      <h3 className={styles.formHeader}>New Booking</h3>
      <div className={styles.formGroup}>
        <label>Pickup Location:</label>
        <select
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select pickup location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Drop Location:</label>
        <select
          name="dropOffLocation"
          value={formData.dropOffLocation}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select drop location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          // min={`${new Date().getHours() + 1 < 10 ? '0' : ''}${new Date().getHours() + 1}:00`}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Vehicle Type:</label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
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
      <div className={styles.formGroup}>
        <h4>Estimated Cost: ₹{estimatedCost}</h4>
      </div>

      <div className={styles.formGroup}>
        <button type="submit" className={styles.submitButton}>
          Book Now
        </button>
      </div>
    </form>
  );
};

export default NewBookingForm;
