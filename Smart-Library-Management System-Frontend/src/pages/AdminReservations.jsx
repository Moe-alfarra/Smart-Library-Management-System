import { Bookmark } from 'lucide-react';

export const AdminReservations = ({ books, onViewReservations }) => {
  const booksWithReservations = books.filter(
    book => book.availableCopies === 0 || (book.reservationCount ?? 0) > 0
  );

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        Reservation Queue
      </h2>

      {booksWithReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No reservation-related books found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {booksWithReservations.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex items-start justify-between"
            >
              <div className="flex-1">
                <h3
                  className="text-xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {book.title}
                </h3>

                <p className="text-gray-600 mb-2">
                  by {book.author}
                </p>

                <p className="text-sm text-gray-500">
                  ISBN: {book.isbn}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    Available: {book.availableCopies}
                  </span>

                  {(book.reservationCount ?? 0) > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Queue: {book.reservationCount}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onViewReservations(book.id)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-semibold"
              >
                View Queue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};