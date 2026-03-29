import { Book, RotateCcw, Trash2 } from 'lucide-react';

export const DeletedBooks = ({
  deletedBooks = [],
  onRestore,
  onPermanentDelete,
}) => {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        Deleted Books
      </h2>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-amber-800 text-sm">
          <strong>ℹ️ Info:</strong> These books have been deleted but their
          borrow history is preserved. You can restore them at any time.
        </p>
      </div>

      {deletedBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No deleted books</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deletedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center relative">
                <Book className="w-20 h-20 text-white opacity-80" />

                <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  DELETED
                </div>
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
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-2 mr-1">
                    {book.category.replace('_', ' ')}
                  </span>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
                    Total Copies: {book.totalCopies}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onRestore(book.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>

                  <button
                    onClick={() => onPermanentDelete(book.id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold flex items-center justify-center gap-2"
                    title="Permanently delete - cannot be undone!"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};