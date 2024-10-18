import usePagination from '../../hooks/isPaginations/usePaginations';
import React, { useState } from 'react';
import Modal from '../Modal/modal';

export default function ManageUserDiv({
  users,
  title,
  subtitle,
  handleUpdateUser,
  setAllUsers,
  type,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  let filteredUser;
  if (type === 'base') {
  } else {
    filteredUser = users.filter(
      (user) =>
        user.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleConfirmDeleteItem = () => {
    setDeleteConfirm(false);
    setDeleteItem(null);
  };

  const handleConfirmDeleteCheck = (user) => {
    setDeleteConfirm(true);
    setDeleteItem(user);
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
  } = usePagination(filteredUser, 10);

  return (
    <div className="artifacts-container">
      <header className="artifacts-header">
        <h1>{title}</h1>
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
              placeholder="Type FullName | UserEmail"
              className="user-search-bar"
              style={{ width: '250px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="artifacts-table-view">
          {filteredUser.length > 0 ? (
            <table className="document-table">
              <thead className="table-header">
                <tr>
                  <th className="header-cell">S. No.</th>
                  <th className="header-cell">Full Name</th>
                  <th className="header-cell">Email</th>
                  <th className="header-cell">Username</th>
                  <th className="header-cell">PhoneNumber</th>
                  <th className="header-cell">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentEntries.map((user, index) => (
                  <tr key={user.id}>
                    <td>{startEntry + index}</td>
                    <td>{user.fullName}</td>
                    <td>{user.userEmail}</td>
                    <td>{user.username}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <div
                        style={{ padding: '2vh', cursor: 'pointer' }}
                        onClick={() => {
                          handleConfirmDeleteCheck(user);
                        }}
                      >
                        <span
                          class="material-symbols-outlined"
                          style={{ color: 'red' }}
                        >
                          delete
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', paddingTop: '10px' }}>
              No User is Present.
            </p>
          )}
        </div>
        {filteredUser.length > 0 && (
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
            <b>Are you sure you want to Delete this {`${subtitle} ?`}</b>
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
                  handleUpdateUser(deleteItem._id, setAllUsers);
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
