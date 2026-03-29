const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elza-glucosidic-johna.ngrok-free.dev/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (response.status === 403) {
            errorMessage = 'You do not have permission to perform this action';
          } else if (response.status === 404) {
            errorMessage = 'Resource not found';
          } else {
            errorMessage = errorData.error;
          }
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      } catch (e) {
        if (response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action';
        } else if (response.status === 404) {
          errorMessage = 'Resource not found';
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to backend. Make sure Spring Boot is running on http://localhost:8080');
    }
    throw err;
  }
};

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: async (name, email, password) => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`${API_BASE_URL}/auth/member/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage;
        
        try {
          const errorData = await response.json();
          
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            if (response.status === 400 && errorData.error === 'Bad Request') {
              errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            } else {
              errorMessage = errorData.error;
            }
          } else {
            errorMessage = 'Registration failed. Please try again.';
          }
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else {
            errorMessage = 'Registration failed. Please try again.';
          }
        }
        
        throw new Error(errorMessage);
      }

      return await response.text();
    },
  },
  reservations: {
    create: (userId, bookId) => request('/reservations', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, book_id: bookId }),
    }),
    cancel: (reservationId) => request(`/reservations/${reservationId}/cancel`, {
        method: 'PUT',
    }),
    getUserReservations: (userId) => request(`/reservations/users/${userId}`),
    getBookReservations: (bookId) => request(`/reservations/book/${bookId}`),
  },
  books: {
    getAll: () => request('/books'),
    getDeleted: () => request('/books/deleted'),
    getById: (id) => request(`/books/id/${id}`),
    getByCategory: (category) => request(`/books/category/${category}`),
    getCategories: () => request('/books/categories'),
    getByTag: (tag) => request(`/books/tag/${tag}`),
    getTags: () => request('/books/tags'),
    addTag: (bookId, tag) => request(`/books/${bookId}/tags/${tag}`, {
      method: 'POST',
    }),
    removeTag: (bookId, tag) => request(`/books/${bookId}/tags/${tag}`, {
      method: 'DELETE',
    }),
    setTags: (bookId, tags) => request(`/books/${bookId}/tags`, {
      method: 'PUT',
      body: JSON.stringify(tags),
    }),
    updateCategory: (bookId, category) => request(`/books/${bookId}/category/${category}`, {
      method: 'PUT',
    }),
    updateCopies: (bookId, totalCopies) => request(`/books/${bookId}/copies`, {
      method: 'PUT',
      body: JSON.stringify({ totalCopies }),
    }),
    create: (book) => request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    }),
    delete: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      
      return { success: true };
    },
    restore: (id) => request(`/books/${id}/restore`, {
      method: 'PUT',
    }),
    permanentDelete: async (id) => {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/books/${id}/permanent`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to permanently delete book');
          }

          return { success: true };
        },
  },

  borrowRecords: {
    borrow: (userId, bookId) => request('/borrow-records', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, book_id: bookId }),
    }),
    return: (borrowId) => request(`/borrow-records/${borrowId}/return`, {
      method: 'PUT',
    }),
    renew: (borrowId) => request(`/borrow-records/${borrowId}/renew`, {
        method: 'PUT',
      }),
    getUserHistory: (userId) => request(`/borrow-records/user/${userId}`),
  },

  users: {
    getById: (id) => request(`/users/id/${id}`),
    getByEmail: (email) => request(`/users/email/${email}`),
    getAll: () => request('/users'),
    delete: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return { success: true };
    },
  },
};
