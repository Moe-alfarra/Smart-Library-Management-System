import { Book, Trash2, Edit } from 'lucide-react';

export const BookCard = ({
  book,
  onBorrow,
  onReserve,
  onDelete,
  onEdit,
  onViewReservations,
  userRole,
  borrowed,
  reserved
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-48 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center">
        <Book className="w-20 h-20 text-white opacity-80" />
      </div>

      <div className="p-6">
        <h3
          className="text-xl font-bold text-gray-800 mb-2"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {book.title}
        </h3>

        <p className="text-gray-600 mb-1">by {book.author}</p>
        <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>

        {book.category && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2 mr-1">
            {book.category.replace('_', ' ')}
          </span>
        )}

        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {book.tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full"
              >
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              book.availableCopies > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {userRole === 'MEMBER' && !borrowed && book.availableCopies > 0 && (
            <button
              onClick={() => onBorrow(book.id)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
            >
              Borrow
            </button>
          )}

          {userRole === 'MEMBER' && !borrowed && book.availableCopies === 0 && !reserved &&(
            <button
              onClick={() => onReserve(book.id)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-semibold"
            >
              Reserve
            </button>
          )}

          {userRole === 'MEMBER' && reserved && book.availableCopies === 0 &&(
            <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-center font-semibold">
              Reserved
            </div>
          )}

          {userRole === 'MEMBER' && borrowed && (
            <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-center font-semibold">
              Already Borrowed
            </div>
          )}

          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => onEdit(book)}
                className="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>


                <button
                  onClick={() => onViewReservations(book.id)}
                  className="flex-1 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition font-semibold"
                >
                  Queue
                </button>


              <button
                onClick={() => onDelete(book.id)}
                className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};