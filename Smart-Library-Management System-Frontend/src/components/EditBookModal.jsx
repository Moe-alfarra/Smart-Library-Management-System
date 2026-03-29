import { X } from 'lucide-react';

export const EditBookModal = ({ show, onClose, book, categories, tags, onSubmit }) => {
  if (!show || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Edit Book
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Book Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>

            <div className="mt-2 text-xs text-gray-500">
              <p>Total Copies: {book.totalCopies}</p>
              <p>Available Copies: {book.availableCopies}</p>
            </div>
          </div>

          {/* Total Copies Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Copies
            </label>

            <input
              id="edit-total-copies"
              type="number"
              min="0"
              defaultValue={book.totalCopies}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>

            <select
              id="edit-category"
              defaultValue={book.category}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>

            <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">

                {tags.map(tag => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="checkbox"
                      data-tag={tag}
                      defaultChecked={book.tags && book.tags.includes(tag)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />

                    <span className="text-sm text-gray-700">
                      {tag.replace('_', ' ')}
                    </span>

                  </label>
                ))}

              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {

                const categorySelect = document.getElementById('edit-category');
                const selectedCategory = categorySelect.value;

                const totalCopiesInput = document.getElementById('edit-total-copies');
                const totalCopies = Number(totalCopiesInput.value);

                const tagCheckboxes = document.querySelectorAll('[data-tag]');
                const selectedTags = Array.from(tagCheckboxes)
                  .filter(cb => cb.checked)
                  .map(cb => cb.dataset.tag);

                onSubmit(book.id, selectedCategory, selectedTags, totalCopies);
              }}

              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold shadow-lg"
            >
              Save Changes
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};