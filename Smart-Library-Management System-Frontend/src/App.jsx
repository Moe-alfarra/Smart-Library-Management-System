import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { AddBookModal } from './components/AddBookModal';
import { EditBookModal } from './components/EditBookModal';
import { BrowseBooks } from './pages/BrowseBooks';
import { MyBooks } from './pages/MyBooks';
import { UsersManagement } from './pages/UsersManagement';
import { DeletedBooks } from './pages/DeletedBooks';
import { api } from './services/api';
import { parseJwt } from './utils/jwt';
import { useToast } from './hooks/useToast';
import { MyReservations } from './pages/MyReservations';
import { Profile } from './pages/Profile';
import { AdminReservations } from './pages/AdminReservations';
import { BookReservationsModal } from './components/BookReservationsModal';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [deletedBooks, setDeletedBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedBookReservations, setSelectedBookReservations] = useState([]);
  const [showBookReservations, setShowBookReservations] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserBorrows, setSelectedUserBorrows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', totalCopies: 1, category: 'GENERAL', tags: [] });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [sortBy, setSortBy] = useState('title-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast, showToast } = useToast();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (token) {
      const userData = parseJwt(token);
      //loadUser(userData);
      setUser(userData);
      loadData(userData);
    } else {
      setLoading(false);
    }
    loadCategories();
    loadTags();
  }, [token]);


  const loadCategories = async () => {
    try {
      const categoriesData = await api.books.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };


  const loadUser = async (decodedToken) => {
    try {
      const userData = await api.users.getById(decodedToken.userId);
      setUser(userData);
      await loadData(userData);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await api.books.getTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadData = async (userData) => {
    setLoading(true);
    setError('');

    try {
      const booksData = await api.books.getAll();
      setBooks(booksData);

      if (userData?.userId) {
        try {
          const recordsData = await api.borrowRecords.getUserHistory(userData.userId);
          setBorrowRecords(recordsData);

          const reservationsData = await api.reservations.getUserReservations(userData.userId);
          setReservations(reservationsData);
        } catch (err) {
          console.error('Error loading user borrow/reservation data:', err);
        }
      }

      if (userData?.role === 'ADMIN') {
        try {
          const usersData = await api.users.getAll();
          setAllUsers(usersData);

          const deletedBooksData = await api.books.getDeleted();
          setDeletedBooks(deletedBooksData);
        } catch (err) {
          console.error('Error loading admin data:', err);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setBooks([]);
    setBorrowRecords([]);
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.borrowRecords.borrow(user.userId, bookId);
      await loadData(user);
      showToast('Book borrowed successfully!', 'success');
    } catch (err) {
      showToast('Failed to borrow book: ' + err.message, 'error');
    }
  };

  const handleReserve = async (bookId) => {
    try {
      await api.reservations.create(user.userId, bookId);
      await loadData(user);
      showToast('Book reserved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to reserve book', 'error');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await api.reservations.cancel(reservationId);
      setShowBookReservations(false);
      await loadData(user);
      showToast('Reservation cancelled successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to cancel reservation', 'error');
    }
  };

  const handleViewBookReservations = async (bookId) => {
    try {
      const data = await api.reservations.getBookReservations(bookId);
      setSelectedBookReservations(data);
      setShowBookReservations(true);
    } catch (err) {
      showToast(err.message || 'Failed to load reservations', 'error');
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await api.borrowRecords.return(borrowId);
      await loadData(user);
      showToast('Book returned successfully!', 'success');
    } catch (err) {
      showToast('Failed to return book: ' + err.message, 'error');
    }
  };
  const handleAdminReturnBorrow = async (borrowId, userId) => {
    try {
      await api.borrowRecords.return(borrowId);

      // immediately update current borrow history in UI
      setSelectedUserBorrows((prev) =>
        prev.map((record) =>
          record.id === borrowId
            ? {
                ...record,
                returnDate: new Date().toISOString(),
              }
            : record
        )
      );

      // refresh server data too
      await loadData(user);
      await handleViewUserBorrows(userId);

      showToast('Book returned successfully!', 'success');
    } catch (err) {
      showToast('Failed to return book: ' + err.message, 'error');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const createdBook = await api.books.create({
        title: newBook.title,
        author: newBook.author,
        isbn: newBook.isbn,
        totalCopies: newBook.totalCopies,
        availableCopies: newBook.totalCopies,
        category: newBook.category,
      });

      if (newBook.tags && newBook.tags.length > 0) {
        await api.books.setTags(createdBook.id, newBook.tags);
      }

      setNewBook({ title: '', author: '', isbn: '', totalCopies: 1, category: 'GENERAL', tags: [] });
      setShowAddBook(false);
      await loadData(user);
      showToast('Book added successfully!', 'success');
    } catch (err) {
      showToast('Failed to add book: ' + err.message, 'error');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.books.delete(bookId);
      await loadData(user);
      showToast('Book deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete book: ' + err.message, 'error');
    }
  };

  const handleRenew = async (borrowId) => {
    try {
      await api.borrowRecords.renew(borrowId);
      await loadData(user);
      showToast('Book renewed successfully', 'success');
    } catch (error) {
      console.log("Renew error object:", error);
      console.log("Renew error message:", error.message);
      console.error('Renew error:', error);
      showToast(error.message || 'Failed to renew book', 'error');
    }
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setShowEditBook(true);
  };

  const handleEditBook = async (bookId, category, selectedTags, totalCopies) => {
    try {
      // Update category
      await api.books.updateCategory(bookId, category);
      
      // Update tags
      await api.books.setTags(bookId, selectedTags);

      await api.books.updateCopies(bookId, totalCopies);
      setShowEditBook(false);
      setEditingBook(null);
      await loadData(user);
      showToast('Book updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update book: ' + err.message, 'error');
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      await applyFilters(category, selectedTag);
    } catch (err) {
      showToast('Failed to filter books: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTagFilter = async (tag) => {
    setSelectedTag(tag);
    setLoading(true);
    try {
      await applyFilters(selectedCategory, tag);
    } catch (err) {
      showToast('Failed to filter books: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (category, tag) => {
    let booksData;

    // Get books based on active filters
    if (category !== 'ALL' && tag !== 'ALL') {
      // Both filters active - get by category first, then filter by tag in frontend
      const categoryBooks = await api.books.getByCategory(category);
      booksData = categoryBooks.filter(book => book.tags && book.tags.includes(tag));
    } else if (category !== 'ALL') {
      // Only category filter
      booksData = await api.books.getByCategory(category);
    } else if (tag !== 'ALL') {
      // Only tag filter
      booksData = await api.books.getByTag(tag);
    } else {
      // No filters - get all
      booksData = await api.books.getAll();
    }

    setBooks(booksData);
  };

  const handleRestoreBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to restore this book?')) return;
    
    try {
      await api.books.restore(bookId);
      await loadData(user);
      showToast('Book restored successfully!', 'success');
    } catch (err) {
      showToast('Failed to restore book: ' + err.message, 'error');
    }
  };

  const handlePermanentDelete = async (bookId) => {
      const confirmed = window.confirm(
        '⚠️ WARNING: This will permanently delete this book from the database!\n\n' +
        'This action CANNOT be undone. The book and all its data will be lost forever.\n\n' +
        'Are you absolutely sure you want to continue?'
      );

      if (!confirmed) return;

      // Double confirmation for safety
      const doubleConfirm = window.confirm(
        '🚨 FINAL CONFIRMATION\n\n' +
        'This is your last chance! The book will be PERMANENTLY DELETED.\n\n' +
        'Click OK to permanently delete, or Cancel to keep the book.'
      );

      if (!doubleConfirm) return;

      try {
        await api.books.permanentDelete(bookId);
        await loadData(user);
        showToast('Book permanently deleted', 'success');
      } catch (err) {
        showToast('Failed to permanently delete: ' + err.message, 'error');
      }
    };


  const handleViewUserBorrows = async (userId) => {
    try {
      const userBorrows = await api.borrowRecords.getUserHistory(userId);
      setSelectedUserBorrows(userBorrows);
    } catch (err) {
      showToast('Failed to load user borrow history: ' + err.message, 'error');
    }
  };

  const handleProfile = async () => {
    try {
      if (!user?.userId) {
        showToast('User not found', 'error');
        return;
      }

      const data = await api.users.getById(user.userId);
      setProfileData(data);
      setActiveTab('profile');
    } catch (err) {
      console.error('Error loading profile:', err);
      showToast(err.message || 'Failed to load profile', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.users.delete(userId);
      await loadData(user);
      showToast('User deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete user: ' + err.message, 'error');
    }
  };

  const handleSearchUserByEmail = async (email) => {
    if (!email.trim()) {
      await loadData(user);
      return;
    }
    
    try {
      const foundUser = await api.users.getByEmail(email);
      setAllUsers([foundUser]);
    } catch (err) {
      showToast('User not found: ' + err.message, 'error');
    }
  };

  const handleSearchUserById = async (id) => {
    if (!id) {
      await loadData(user);
      return;
    }
    
    try {
      const foundUser = await api.users.getById(id);
      setAllUsers([foundUser]);
    } catch (err) {
      showToast('User not found: ' + err.message, 'error');
    }
  };

  const borrowedBookIds = new Set(
    borrowRecords
      .filter(record => !record.returnDate)
      .map(record => record.book?.id)
  );

  const reservedBookIds = new Set(
    reservations.filter(r => r.status === 'ACTIVE').map(r => r.book?.id)
  )

  // Apply sorting to books
  const sortBooks = (booksToSort) => {
    const sorted = [...booksToSort];
    switch (sortBy) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'author-asc':
        return sorted.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sorted.sort((a, b) => b.author.localeCompare(a.author));
      case 'popular':
        return sorted.sort((a, b) => (b.borrowedBooksCount || 0) - (a.borrowedBooksCount || 0));
      default:
        return sorted;
    }
  };

  const sortedBooks = sortBooks(books);

  if (!token) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-red-600">Connection Error</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => loadData(user)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Header user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Browse Books
          </button>

          {user?.role === 'MEMBER' && (
            <>
              <button
                onClick={() => setActiveTab('myBooks')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'myBooks'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Books
              </button>

              <button
                onClick={() => setActiveTab('myReservations')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'myReservations'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Reservations
              </button>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Users Management
              </button>

              <button
                onClick={() => setActiveTab('deletedBooks')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'deletedBooks'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Deleted Books ({deletedBooks.length})
              </button>

              <button
                onClick={() => setActiveTab('viewReservations')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'viewReservations'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                View Reservations
              </button>
            </>
          )}

          <button
            onClick={handleProfile}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Browse Books Tab */}
        {activeTab === 'browse' && (
          <BrowseBooks
            books={sortedBooks}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            onCategoryFilter={handleCategoryFilter}
            selectedTag={selectedTag}
            tags={tags}
            onTagFilter={handleTagFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            userRole={user?.role}
            borrowedBookIds={borrowedBookIds}
            reservedBookIds={reservedBookIds}
            onBorrow={handleBorrow}
            onReserve={handleReserve}
            onDelete={handleDeleteBook}
            onEdit={handleOpenEditBook}
            onViewReservations={handleViewBookReservations}
            onAddBook={() => setShowAddBook(true)}
          />
        )}

        {/* My Books Tab */}
        {activeTab === 'myBooks' && user?.role === 'MEMBER'&& (
          <MyBooks
            borrowRecords={borrowRecords}
            onReturn={handleReturn}
            onRenew={handleRenew}
            user={user}
          />
        )}

        {activeTab === 'myReservations' && user?.role === 'MEMBER' && (
          <MyReservations
            reservations={reservations}
            onCancel={handleCancelReservation}
          />
        )}

        {activeTab === 'viewReservations' && user?.role === 'ADMIN' && (
          <AdminReservations
            books={books}
            onViewReservations={handleViewBookReservations}
          />
        )}

        {activeTab === 'profile' && <Profile user={profileData} />}

        {/* Users Management Tab (Admin Only) */}
        {activeTab === 'users' && user?.role === 'ADMIN' && (
          <UsersManagement
            allUsers={allUsers}
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            onSearchByEmail={handleSearchUserByEmail}
            onSearchById={handleSearchUserById}
            onViewUserBorrows={handleViewUserBorrows}
            onDeleteUser={handleDeleteUser}
            onShowAll={() => loadData(user)}
            selectedUserBorrows={selectedUserBorrows}
            currentUserId={user?.userId}
            onReturnBorrow={handleAdminReturnBorrow}
          />
        )}

        {/* Deleted Books Tab (Admin Only) */}
        {activeTab === 'deletedBooks' && user?.role === 'ADMIN' && (
          <DeletedBooks
            deletedBooks={deletedBooks}
            onRestore={handleRestoreBook}
            onPermanentDelete={handlePermanentDelete}
          />
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        show={showAddBook}
        onClose={() => setShowAddBook(false)}
        newBook={newBook}
        setNewBook={setNewBook}
        categories={categories}
        tags={tags}
        onSubmit={handleAddBook}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        show={showEditBook}
        onClose={() => {
          setShowEditBook(false);
          setEditingBook(null);
        }}
        book={editingBook}
        categories={categories}
        tags={tags}
        onSubmit={handleEditBook}
      />

      <BookReservationsModal
        show={showBookReservations}
        onClose={() => setShowBookReservations(false)}
        reservations={selectedBookReservations}
        onCancelReservation={handleCancelReservation}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => showToast('', 'success')} />
    </div>
  );
}

export default App;
