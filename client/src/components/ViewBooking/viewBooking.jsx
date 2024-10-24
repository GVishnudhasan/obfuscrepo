import usePagination from '../../hooks/isPaginations/usePaginations';
import React, { useState, useEffect } from 'react';
import Modal from '../Modal/modal';
import { Link } from 'react-router-dom';
import { updateBookingStatus } from '../../server/booking/booking';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import for map styles
import { REACT_APP_API_URL } from '../../parameter/parameter';
const socket = io(`${REACT_APP_API_URL}`); // Adjust as per your backend
// const socket = io('http://localhost:8080');
export default function ViewBooking({
  viewBooking,
  deleteBookingHandler,
  userId,
  setViewBooking,
  type,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bookingToTrack, setBookingToTrack] = useState(null);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);

  const filteredBooking = viewBooking
    .filter((booking) => {
      const matchesSearchQuery =
        booking.pickupLocation
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.dropOffLocation
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesSearchQuery;
    })
    .sort((a, b) => {
      const statusOrder = {
        current: 1,
        pending: 2,
        completed: 3,
      };
      return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    });

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleConfirmDeleteItem = () => {
    setDeleteConfirm(false);
    setDeleteItem(null);
  };

  const handleConfirmDeleteCheck = (booking) => {
    setDeleteConfirm(true);
    setDeleteItem(booking);
  };

  const {
    currentPage,
    entriesPerPage,
    currentEntries,
    handlePageChange,
    handleEntriesChange,
    totalEntries,
    startEntry,
    endEntry,
    totalPages,
  } = usePagination(filteredBooking, 10);

  const UpdateBookingStatus = async (bookingId, status) => {
    updateBookingStatus(bookingId, userId, status);
  };

  const customIcon = L.icon({
    iconUrl: './assets/car.png', // Replace with your icon path
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 30], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -30], // Point from which the popup should open relative to the iconAnchor
  });

  // Function to handle tracking the ride for users
  const handleTrackRide = (booking) => {
    setBookingToTrack(booking);
    setTrackModalOpen(true);
    socket.on('updateLocation', (locationData) => {
      console.log('Location data:', locationData);
      if (locationData.bookingId === booking._id) {
        setCurrentLocation({
          lat: booking.driverLatitude,
          lng: booking.driverLongitude,
        });
      }
    });
  };

  // Function to handle location sharing for drivers
  // const handleShareLocation = (booking) => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         // Emit the location data to the backend
  //         socket.emit('driverLocationUpdate', {
  //           bookingId: booking._id, // Pass the booking ID to identify which booking this location is for
  //           lat: latitude,
  //           lng: longitude,
  //         });

  //         console.log(`Sharing location for booking ${booking._id}:`, {
  //           latitude,
  //           longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error('Error retrieving driver location:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // };
  const handleShareLocation = (booking) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    // If already sharing, stop sharing first
    if (sharingLocation) {
      clearInterval(locationInterval);
      setSharingLocation(false);
      setLocationInterval(null);
      return;
    }

    setSharingLocation(true);

    // Start watching the position
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Emit the location to the backend
        const emitLocation = () => {
          socket.emit('driverLocationUpdate', {
            bookingId: booking._id,
            lat: latitude,
            lng: longitude,
          });
        };

        // Set an interval to emit location every 5 seconds
        const interval = setInterval(emitLocation, 5000);
        setLocationInterval(interval);
      },
      (error) => {
        console.error('Error getting position:', error);
      },
      {
        enableHighAccuracy: true, // You can adjust this based on your requirements
      }
    );
  };

  const closeTrackModal = () => {
    setTrackModalOpen(false);
    setBookingToTrack(null);
    setCurrentLocation(null);
    socket.emit('stop-tracking');
  };

  const AutoCenter = ({ location }) => {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView([location.lat, location.lng], 13);
      }
    }, [location, map]);

    return null;
  };

  

  return (
    <div className="artifacts-container">
      <header className="artifacts-header">
        <h1>My Bookings</h1>
      </header>
      <div className="artifacts-table-container">
        <div className="header-select-entries">
          <div className="select-entries">
            Show
            <select onChange={handleEntriesChange} value={entriesPerPage}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </div>
          <div className="user-search">
            <label>Search</label>
            <input
              type="text"
              placeholder="Type pickup | drop-off location..."
              className="user-search-bar"
              style={{ width: '250px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="artifacts-table-view">
          {filteredBooking.length > 0 ? (
            <table className="document-table">
              <thead className="table-header">
                <tr>
                  <th className="header-cell">S. No.</th>
                  <th className="header-cell">Pickup Location</th>
                  <th className="header-cell">Drop-off Location</th>
                  <th className="header-cell">Booking Date</th>
                  <th className="header-cell">Booking Time</th>
                  <th className="header-cell">Booking Status</th>
                  <th className="header-cell">Action</th>
                  <th className="header-cell">
                    {type === 'user' ? 'Track Ride' : 'Share Location'}
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentEntries.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{startEntry + index}</td>
                    <td>{booking.pickupLocation}</td>
                    <td>{booking.dropOffLocation}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{formatTime(booking.time)}</td>
                    <td>
                      {type === 'user' ? (
                        <span>{booking.status}</span>
                      ) : (
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            UpdateBookingStatus(booking._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="En-route to pickup">
                            En-route to pickup
                          </option>
                          <option value="Goods collected">
                            Goods collected
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                    <td>
                      {booking.status === 'pending' ? (
                        <button
                          className="addEntryButton"
                          style={{
                            backgroundColor: 'white',
                            color: 'red',
                            border: '1px solid red',
                          }}
                          onClick={() => handleConfirmDeleteCheck(booking)}
                        >
                          Cancel Tour
                        </button>
                      ) : booking.status === 'Delivered' ? (
                        <span>Completed Tour</span>
                      ) : (
                        <span>Current Tour</span>
                      )}
                    </td>
                    <td>
                      {type === 'user' ? (
                        <button
                          className="addEntryButton"
                          style={{
                            backgroundColor: 'white',
                            color: 'blue',
                            border: '1px solid blue',
                          }}
                          onClick={() => handleTrackRide(booking)}
                        >
                          Track Ride
                        </button>
                      ) : (
                        <button
                          className="addEntryButton"
                          style={{
                            backgroundColor: 'white',
                            color: 'green',
                            border: '1px solid green',
                          }}
                          onClick={() => handleShareLocation(booking)}
                        >
                          {sharingLocation ? 'Stop Sharing Location' : 'Share Location'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', paddingTop: '10px' }}>
              No tour is booked. Please go to the New Booking page.
            </p>
          )}
        </div>
        {trackModalOpen && bookingToTrack && (
          <Modal isOpen={trackModalOpen} onClose={closeTrackModal}>
            <h2>Tracking Ride for Booking ID: {bookingToTrack._id}</h2>
            <div
              style={{ height: '300px', width: '100%', position: 'relative' }}
            >
              {/* MapContainer with dynamic center based on current location */}
              <MapContainer
                center={
                  currentLocation
                    ? [currentLocation.lat, currentLocation.lng]
                    : [0, 0]
                }
                zoom={13}
                style={{ height: '80%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {currentLocation && (
                  <>
                    <Marker
                      position={[currentLocation.lat, currentLocation.lng]}
                      icon={customIcon}
                    >
                      <Popup>
                        Driver is here: {currentLocation.lat},{' '}
                        {currentLocation.lng}
                      </Popup>
                    </Marker>
                    {/* Auto-center the map on location change */}
                    <AutoCenter location={currentLocation} />
                  </>
                )}
              </MapContainer>
              <button className="mt-0 px-4 py-2 ml-48 bg-red-500 text-white rounded hover:bg-red-600" onClick={closeTrackModal}>Close</button>
            </div>
          </Modal>
        )}
        {filteredBooking.length > 0 && (
          <div className="pagination">
            <p>
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </p>
            <div className="pagination-buttons">
              <button
                className="addEntryButton"
                style={{
                  backgroundColor: 'white',
                  color: 'green',
                  width: '65px',
                  border: '1px solid green',
                }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="addEntryButton"
                style={{
                  backgroundColor: 'white',
                  color: 'green',
                  width: '50px',
                  border: '1px solid green',
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {deleteConfirm && (
          <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
            <div>
              <h2>Are you sure you want to cancel this booking?</h2>
              <div>
                <button onClick={() => deleteBookingHandler(deleteItem)}>
                  Yes, cancel it
                </button>
                <button onClick={handleConfirmDeleteItem}>No, keep it</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
