import { Search, Plus, Book } from 'lucide-react';
import { BookCard } from '../components/BookCard';

export const BrowseBooks = ({
  books,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  categories,
  onCategoryFilter,
  selectedTag,
  tags,
  onTagFilter,
  sortBy,
  onSortChange,
  userRole,
  borrowedBookIds,
  reservedBookIds,
  onBorrow,
  onReserve,
  onDelete,
  onEdit,
  onViewReservations,
  onAddBook
}) => {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  return (
    <div>
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => onTagFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="ALL">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="author-asc">Author (A-Z)</option>
            <option value="author-desc">Author (Z-A)</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={onAddBook}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="loading mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={onBorrow}
              onReserve={onReserve}
              onDelete={onDelete}
              onEdit={onEdit}
              onViewReservations={onViewReservations}
              userRole={userRole}
              borrowed={borrowedBookIds.has(book.id)}
              reserved={reservedBookIds.has(book.id)}
            />
          ))}
        </div>
      )}

      {!loading && filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No books found</p>
        </div>
      )}
    </div>
  );
};
