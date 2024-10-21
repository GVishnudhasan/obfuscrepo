# Atlan ODL (On-Demand Logistics) Platform

## Overview
Atlan ODL is a scalable platform designed for efficient goods transportation and logistics services. The system handles high-frequency requests, including real-time vehicle tracking and booking management, ensuring optimal performance even under heavy loads. 

The platform is developed with modern web technologies, employing a microservices architecture, load balancing, and asynchronous operations to manage scalability and handle millions of requests per second.

## Example Credentials for Testing

- **User Login**: 
  - Email: `user2@test.com`
  - Password: `User2`
- **Driver Login**: 
  - Email: `driver2@test.com`
  - Password: `Driver2`
- **Admin Login**: 
  - Email: `admin2@test.com`
  - Password: `Admin2`


## Project Demo

Check out the project demo on YouTube: [Demo Video](https://youtu.be/9rUsVVkEUvc?si=rBcCnKHYVRM8fgS0)

    
## ER Diagram
![ER Diagram](https://github.com/user-attachments/assets/7e500303-ca9d-4472-a424-d3928e264e04)


## Architecture Diagram

![Architecture](https://github.com/user-attachments/assets/14468764-88b3-4115-9e89-6cd360293ba1)

---
## Major Design Decisions and Trade-offs

### **Scalability and High-Performance Handling**
- **Component-Based Architecture**: 
  The platform utilizes a modular structure using React.js for the frontend, ensuring maintainability and easier future updates.
  - **Trade-off**: Initial setup complexity and a learning curve for new developers.
  
- **State Management**: 
  React's state management with hooks (`useState`, `useEffect`) is used for handling real-time data efficiently, such as vehicle tracking and booking status updates.
  - **Trade-off**: Managing global state for larger applications can introduce complexity.

- **Asynchronous Operations**: 
  Asynchronous data fetching and form submissions prevent blocking the main thread, ensuring smooth user interactions, especially during booking and tracking.

### **High-Volume Traffic Management**
- **Backend Optimization**:
  The backend is built using Node.js and Express, optimized for handling multiple concurrent requests through efficient resource management.
  - **Trade-off**: Requires careful resource monitoring to prevent overload.

- **Asynchronous Functions**: 
  High-volume requests are handled using Axios for HTTP operations, enabling asynchronous operations and efficient real-time updates.
  
- **Microservices Architecture**: 
  Different services, such as user authentication, booking management, and real-time tracking, are split into microservices, enabling independent scaling.
  - **Trade-off**: Complexity in managing inter-service communication and ensuring data consistency.

## Core Features

### **Booking Management**
- Users can create, update, view, and delete bookings via the platform. The booking system ensures smooth form submissions with validation and asynchronous data handling.
  
### **Real-time Vehicle Tracking** 
- Vehicle location is updated in real time, allowing users to track the status of their deliveries. Updates to vehicle locations are efficiently managed to avoid system overload through throttling and efficient database operations.

### **Dynamic Pricing Algorithm** 
- The platform calculates the estimated price based on factors like distance, demand, and vehicle type. This dynamic pricing adjusts to real-time market demand and supply.

  **Key Algorithm**:
  - Distance between pickup and drop-off points.
  - Vehicle type availability.
  - Real-time demand in the user's region.

### **Matching Algorithm**
- A sophisticated matching algorithm is employed to assign drivers to users based on proximity, vehicle type, and availability. The algorithm ensures that the closest available driver with the appropriate vehicle is matched to the user's request.
  - Factors considered: 
    - Vehicle availability and type.
    - Real-time location and proximity to pickup.
    - Current demand and traffic conditions.

### **User and Driver Management**
- Admins can manage users and drivers, including pagination, search, and deletion functionalities. This ensures streamlined management of the growing user base.

### **Notification System**
- Real-time success and error notifications are handled using `react-toastify`, ensuring users are kept informed throughout their interaction with the platform.

### **Frequent Location Updates Management**
- Frequent updates to vehicle locations are managed using a combination of real-time web sockets and throttling mechanisms. This prevents overloading the system while ensuring accurate location data. 
  - Throttling ensures that location updates occur at a reasonable frequency (e.g., every few seconds) rather than continuously, thus avoiding unnecessary load.

### **Database Consistency**
- The platform maintains consistency across databases by employing optimized indexing strategies and distributed caching to handle frequent updates without performance degradation. 

## Technical Implementations

### **Booking Handling**
- **File**: `client/src/server/booking/booking.jsx`
- Functions:
  - `handleBookingSubmit`: Manages form submissions, validation, and asynchronous data updates.
  - `fetchUserBookingInfo`, `deleteBookingHandler`, `updateBookingStatus`: Handle various booking-related operations.

### **User Management**
- **File**: `client/src/components/ManageUser/manageUser.jsx`
- Functions:
  - Handles pagination, search, and deletion of users.

### **Real-time Vehicle Tracking**
- **File**: `client/src/server/tracking/vehicleTracking.jsx`
- Utilizes WebSockets and APIs for updating and fetching vehicle locations in real time.

### **Error and Success Notifications**
- **File**: `client/src/utils/logMessage.jsx`
- Functions:
  - `ShowErrorMessage`, `ShowSuccessMessage`: Handle real-time error/success notifications for users and admin.

## Show Stoppers

### **Error Handling**
- Robust error handling is crucial to prevent crashes or incorrect data submissions. The platform uses a centralized logging system for error reporting.

### **Form Validation**
- Ensuring all forms, especially for bookings and user registrations, are validated to prevent incorrect or incomplete submissions.

### **Vehicle Location and Database Updates**
- Managing high-frequency updates such as vehicle locations is a challenge. The platform uses optimized database queries and caching to ensure consistent data without overloading the system.
