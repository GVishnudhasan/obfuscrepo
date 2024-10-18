import React from 'react';
import styles from './analytics.module.css';
import { BarChartJS } from '../ChartsJS/BarChart';
import { PieChartJS } from '../ChartsJS/PieChart';

export default function analyticsDiv({ userCount, driverCount, bookings }) {
  // Function to get last 7 days' dates
  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
  };

  const labels = getLast7Days();

  // Aggregate bookings by day
  const aggregateBookingsByDay = () => {
    const bookingsCount = {};
    labels.forEach((date) => {
      bookingsCount[date] = 0;
    });

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      if (bookingsCount[bookingDate] !== undefined) {
        bookingsCount[bookingDate]++;
      }
    });

    return labels.map((date) => bookingsCount[date]);
  };

  // Fleet management analytics: Count vehicles by status
  const countAvailableVehicles = () => {
    const vehicleAvailability = {};

    bookings.forEach((booking) => {
      const { vehicleType, status } = booking;
      if (!vehicleAvailability[vehicleType]) {
        vehicleAvailability[vehicleType] = {
          pending: 0,
          enRoute: 0,
          goodsCollected: 0,
          delivered: 0,
        };
      }
      // Categorize vehicles by status
      if (status === 'pending') {
        vehicleAvailability[vehicleType].pending++;
      } else if (status === 'En-route to pickup') {
        vehicleAvailability[vehicleType].enRoute++;
      } else if (status === 'Goods collected') {
        vehicleAvailability[vehicleType].goodsCollected++;
      } else if (status === 'Delivered') {
        vehicleAvailability[vehicleType].delivered++;
      }
    });

    return vehicleAvailability;
  };

  // Calculate additional analytics
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.estimatedCost, 0);
  const averageBookingCost = totalRevenue / bookings.length || 0;

  const userBookings = bookings.filter(booking => !booking.cabId).length;
  // const driverBookings = bookings.length - userBookings;

  const vehicleTypeCount = {};
  bookings.forEach(booking => {
    if (!vehicleTypeCount[booking.vehicleType]) {
      vehicleTypeCount[booking.vehicleType] = 0;
    }
    vehicleTypeCount[booking.vehicleType]++;
  });

  // const topVehicleTypes = Object.keys(vehicleTypeCount).sort((a, b) => vehicleTypeCount[b] - vehicleTypeCount[a]).slice(0, 3);

  // Bar chart for vehicle availability by status
  const vehicleAvailability = countAvailableVehicles();
  const vehicleTypes = Object.keys(vehicleAvailability);
  const pendingData = vehicleTypes.map(type => vehicleAvailability[type].pending);
  const enRouteData = vehicleTypes.map(type => vehicleAvailability[type].enRoute);
  const goodsCollectedData = vehicleTypes.map(type => vehicleAvailability[type].goodsCollected);
  const deliveredData = vehicleTypes.map(type => vehicleAvailability[type].delivered);

  // Bar chart for bookings in the last 7 days
  const barData = {
    labels,
    datasets: [
      {
        label: 'Number of Bookings',
        data: aggregateBookingsByDay(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for user vs driver count
  const pieData = {
    labels: ['Users', 'Drivers'],
    datasets: [
      {
        label: 'User vs Driver Count',
        data: [userCount, driverCount],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart for vehicle availability by status
  const vehicleBarData = {
    labels: vehicleTypes,
    datasets: [
      {
        label: 'Pending',
        data: pendingData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'En-route to Pickup',
        data: enRouteData,
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Goods Collected',
        data: goodsCollectedData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Delivered',
        data: deliveredData,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          width: '100%',
          height: '10vh',
          marginBottom: '5vh',
        }}
      >
        <h3 style={{ fontSize: '3vh' }}>My Analytics</h3>
      </div>
  
      {/* Summary at the top */}
      <div className={styles.analyticsContainer} style={{ marginBottom: '2vh', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {/* Each metric in its own card */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Total Revenue: <b>Rs.{totalRevenue.toFixed(2)}</b></p>
        </div>
        
        <div className={styles.card}>
          <p className={styles.chartTitle}>Total Users: <b>{userCount + driverCount}</b></p>
        </div>
        <div className={styles.card}>
          <p className={styles.chartTitle}>Total Bookings: <b>{bookings.length}</b></p>
        </div>
        <div className={styles.card}>
          <p className={styles.chartTitle}>Average Booking Cost: <b>Rs.{averageBookingCost.toFixed(2)}</b></p>
        </div>
      </div>
  
      {/* User and driver distribution */}
      <div className={styles.analyticsContainer}>
        <div className={styles.chartWrapper}>
          <p className={styles.chartTitle}>User and Driver Distribution</p>
          <PieChartJS chartData={pieData} />
        </div>
  
        {/* Bookings in the last 7 days */}
        <div className={styles.chartWrapper}>
          <p className={styles.chartTitle}>Bookings in the Last 7 Days</p>
          <BarChartJS
            chartData={barData}
            max={Math.max(...aggregateBookingsByDay()) + 5}
          />
        </div>
      </div>
      <br />
      
      {/* Fleet availability by vehicle type and status */}
      <div className={styles.analyticsContainer}>
        <div className={styles.chartWrapper}>
          <p className={styles.chartTitle}>Fleet of Available Vehicles</p>
          <BarChartJS chartData={vehicleBarData} />
        </div>
      </div>
    </div>
  );
  
}
