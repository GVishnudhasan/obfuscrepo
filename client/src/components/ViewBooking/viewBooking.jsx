import usePagination from '../../hooks/isPaginations/usePaginations';
import React, { useState } from 'react';
import Modal from '../Modal/modal';
import { Link } from 'react-router-dom';
import { updateBookingStatus } from '../../server/booking/booking';

export default function ViewBooking({
  viewBooking,
  deleteBookingHandler,
  userId,
  setViewBooking,
  type,
}) {
  const [searchQuery, setSearchQuery] = useState('');
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
  }

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
                    {/* Conditionally render booking status or a dropdown for updating status */}
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
                          <option value="En-route to pickup">En-route to pickup</option>
                          <option value="Goods collected">Goods collected</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: type ? '10px' : '' }}>
                      {booking.status === 'pending' ? (
                        <button
                          className="addEntryButton"
                          style={{
                            backgroundColor: 'white',
                            color: 'red',
                            width: '90px',
                            border: '1px solid red',
                          }}
                          onClick={() => {
                            handleConfirmDeleteCheck(booking);
                          }}
                        >
                          Cancel Tour
                        </button>
                      ) : booking.status === 'current' ? (
                        <span>Current Tour</span>
                      ) : (
                        <span>Completed Tour</span>
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
            <b>Are you sure you want to Delete this Tour ?</b>
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
                  deleteBookingHandler(deleteItem._id, userId, setViewBooking);
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
