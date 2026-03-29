import { Calendar, BookOpen } from 'lucide-react';

export const MyBooks = ({ borrowRecords, onReturn, onRenew, user }) => {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        My Borrowed Books
      </h2>

      <div className={`mb-6 inline-block px-4 py-2 rounded-full text-sm font-semibold ${
        borrowRecords.filter(record => !record.returnDate).length >= 5
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700'
      }`}>
        Available Borrows: {5 - borrowRecords.filter(record => !record.returnDate).length}/5
      </div>

      {borrowRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven't borrowed any books yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowRecords.map(record => {
            const isOverdue = record.dueDate && new Date(record.dueDate) < new Date();
            const renewalCount = record.renewalCount ?? 0;
            const canRenew = !record.returnDate && !isOverdue && renewalCount < 2;

            return (
              <div key={record.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {record.book?.title || 'Unknown Book'}
                    </h3>

                    <p className="text-gray-600 mb-2">
                      by {record.book?.author || 'Unknown Author'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Borrowed: {new Date(record.borrowDate).toLocaleDateString()}
                      </div>

                      {record.dueDate && !record.returnDate && (
                        <div
                          className={`flex items-center gap-2 ${
                            isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(record.dueDate).toLocaleDateString()}
                          {isOverdue && ' (OVERDUE)'}
                        </div>
                      )}

                      {record.returnDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Returned: {new Date(record.returnDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {!record.returnDate && (
                      <div className="mt-3 inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        Renewals Used: {renewalCount}/2
                      </div>
                    )}

                    {record.fineAmount > 0 && (
                      <div className="mt-2 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Late Fee: ${record.fineAmount}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {!record.returnDate ? (
                      <>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isOverdue
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>

                        <button
                          onClick={() => onReturn(record.id)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
                        >
                          Return Book
                        </button>

                        <button
                          onClick={() => onRenew(record.id)}
                          disabled={!canRenew}
                          className={`px-4 py-2 rounded-lg transition font-semibold ${
                            canRenew
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {renewalCount >= 2
                            ? 'Max Renewed'
                            : isOverdue
                            ? 'Cannot Renew'
                            : 'Renew'}
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        Returned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};