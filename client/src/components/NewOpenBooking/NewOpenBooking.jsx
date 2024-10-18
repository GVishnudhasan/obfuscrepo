import usePagination from '../../hooks/isPaginations/usePaginations';
import React, { useState, useEffect } from 'react';
import Modal from '../Modal/modal';

export default function ViewNewOpenBooking({
  viewBooking,
  userId,
  deleteBookingHandler,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [swipedBookings, setSwipedBookings] = useState(new Set());

  useEffect(() => {
    const storedSwipedBookings = localStorage.getItem('swipedBookings');
    if (storedSwipedBookings) {
      setSwipedBookings(new Set(JSON.parse(storedSwipedBookings)));
    }
  }, []);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleConfirmDeleteItem = () => {
    setDeleteConfirm(false);
    setDeleteItem(null);
  };

  const handleConfirmDeleteCheck = (booking) => {
    setDeleteConfirm(true);
    setDeleteItem(booking);
  };

  const filteredBooking = viewBooking.filter(
    (booking) =>
      !swipedBookings.has(booking._id) &&
      (booking.pickupLocation
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        booking.dropOffLocation
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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

  const handleSwipe = (bookingId) => {
    const updatedSwipedBookings = new Set(swipedBookings).add(bookingId);
    setSwipedBookings(updatedSwipedBookings);
    localStorage.setItem(
      'swipedBookings',
      JSON.stringify([...updatedSwipedBookings])
    );
  };

  return (
    <div className="artifacts-container">
      <header className="artifacts-header">
        <h1>Available Booking Requests</h1>
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
              placeholder="Pickup or drop location"
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
                  <th className="header-cell">Drop Location</th>
                  <th className="header-cell">Booking Date</th>
                  <th className="header-cell">Booking Time</th>
                  <th className="header-cell">Allocation Action</th>
                  <th className="header-cell">Cancel Action</th>
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
                      <button
                        className="addEntryButton"
                        style={{
                          backgroundColor: 'white',
                          color: 'green',
                          width: '90px',
                          border: '1px solid green',
                        }}
                        onClick={() => {
                          handleConfirmDeleteCheck(booking);
                        }}
                      >
                        Start
                      </button>
                    </td>
                    <td>
                      <button
                        className="addEntryButton"
                        style={{
                          backgroundColor: 'white',
                          color: 'red',
                          width: '90px',
                          border: '1px solid red',
                        }}
                        onClick={() => handleSwipe(booking._id)}
                      >
                        Reject
                      </button>
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
      </div>
      {deleteConfirm && deleteItem && (
        <Modal isOpen={deleteConfirm}>
          <div
            style={{
              width: '80%',
              margin: 'auto',
              height: '100%',
              display: 'flex',
              padding: '5vh',
              textAlign: 'center',
              flexDirection: 'column',
              gap: '3vh',
              alignItems: 'center',
            }}
          >
            <b>Are you sure you want to Take this Tour ?</b>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2vh',
              }}
            >
              <button
                className="addEntryButton"
                style={{
                  backgroundColor: 'white',
                  color: 'green',
                  border: '1px solid green',
                }}
                onClick={() => {
                  deleteBookingHandler(deleteItem._id, userId);
                  handleConfirmDeleteItem();
                }}
              >
                Yes
              </button>
              <button
                className="addEntryButton"
                style={{
                  backgroundColor: 'white',
                  color: 'red',
                  border: '1px solid red',
                }}
                onClick={() => handleConfirmDeleteItem()}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
