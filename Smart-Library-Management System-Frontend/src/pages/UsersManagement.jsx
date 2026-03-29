import { User, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export const UsersManagement = ({
  allUsers,
  userSearchQuery,
  setUserSearchQuery,
  onSearchByEmail,
  onSearchById,
  onViewUserBorrows,
  onDeleteUser,
  onShowAll,
  selectedUserBorrows,
  currentUserId,
  onReturnBorrow
}) => {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        Users Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search by Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => onSearchByEmail(userSearchQuery)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search by User ID
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter user ID..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearchById(parseInt(e.target.value));
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                onSearchById(parseInt(input.value));
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">Total Users: {allUsers.length}</p>
        <button
          onClick={onShowAll}
          className="px-4 py-2 text-orange-600 hover:text-orange-700 font-semibold"
        >
          Show All Users
        </button>
      </div>

      <div className="space-y-4">
        {allUsers.map((userItem) => (
          <div
            key={userItem.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {userItem.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      userItem.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {userItem.role}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">Email: {userItem.email}</p>
                <p className="text-sm text-gray-500">User ID: {userItem.id}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onViewUserBorrows(userItem.id)}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold"
                >
                  View Borrows
                </button>

                {userItem.id !== currentUserId && (
                  <button
                    onClick={() => onDeleteUser(userItem.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {selectedUserBorrows.length > 0 &&
              selectedUserBorrows[0]?.user?.id === userItem.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Borrow History:
                  </h4>

                  <div className="space-y-3">
                    {selectedUserBorrows.map((record) => {
                      const isOverdue =
                        record.dueDate &&
                        !record.returnDate &&
                        new Date(record.dueDate) < new Date();

                      const isActive = !record.returnDate;

                      return (
                        <div
                          key={record.id}
                          className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-100"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {record.book?.title}
                              </p>
                              <p className="text-gray-600">
                                by {record.book?.author}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-3">
                                {isActive ? (
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                      isOverdue
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {isOverdue ? 'Overdue' : 'Currently Borrowed'}
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                    Returned
                                  </span>
                                )}

                                {record.fineAmount > 0 && (
                                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                    Fine: ${record.fineAmount}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right text-gray-500">
                              <p>
                                Borrowed:{' '}
                                {new Date(record.borrowDate).toLocaleDateString()}
                              </p>

                              {record.dueDate && !record.returnDate && (
                                <p
                                  className={
                                    isOverdue ? 'text-red-600 font-semibold' : ''
                                  }
                                >
                                  Due: {new Date(record.dueDate).toLocaleDateString()}
                                  {isOverdue && ' (OVERDUE)'}
                                </p>
                              )}

                              {record.returnDate && (
                                <p className="text-green-600">
                                  Returned:{' '}
                                  {new Date(record.returnDate).toLocaleDateString()}
                                </p>
                              )}

                              {isActive && (
                                <button
                                  onClick={() => onReturnBorrow(record.id, userItem.id)}
                                  className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                                >
                                  Return Book
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>

      {allUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};