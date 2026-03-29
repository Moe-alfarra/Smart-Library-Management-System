package com.moeAlfarra.Smart_Library_Management_System.service;

import com.moeAlfarra.Smart_Library_Management_System.entity.Book;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookCategory;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookTag;
import com.moeAlfarra.Smart_Library_Management_System.entity.BorrowStatus;
import com.moeAlfarra.Smart_Library_Management_System.repository.BookRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.BorrowRecordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public BookService(BookRepository bookRepository, BorrowRecordRepository borrowRecordRepository) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public long getBooksCount() {
        return bookRepository.count();
    }
    // Create book
    public Book createBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book already exists");
        }
        if (book.getCategory() == null) {
            book.setCategory(BookCategory.GENERAL);
        }
        book.setCategory(book.getCategory());
        return bookRepository.save(book);
    }

    // Get book by ID
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not Found"));
    }

    // Get book by ISBN
    public Book getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not Found"));
    }

    // Get book by category
    public List<Book> getBooksByCategory(BookCategory category) {
        return bookRepository.findByDeletedFalseAndCategory(category);
    }

    // update book's category
    public Book updateBookCategory(Long bookId, BookCategory category) {
        Book book = getBookById(bookId);
        book.setCategory(category);
        return bookRepository.save(book);
    }

    /// Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findByDeletedFalse();
    }

    // Soft Delete book
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not Found"));

        // Check if any ACTIVE borrows exist
        long activeCount = borrowRecordRepository.countByBookIdAndStatus(id, BorrowStatus.BORROWED);
        if (activeCount > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete book with active borrows");
        }

        // Soft delete
        book.setDeleted(true);
        bookRepository.save(book);
    }

    // Permanently delete book
    public void permanentlyDeleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not Found"));

        // Check if book has any borrow records
        long totalBorrows = borrowRecordRepository.findAll().stream()
                .filter(record -> record.getBook().getId().equals(id))
                .count();

        if (totalBorrows > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot permanently delete book with borrow history. Contact System Administrator");
        }

        // Hard delete from database
        bookRepository.delete(book);
    }

    // Get soft deleted books
    public List<Book> getDeletedBooks() {
        return bookRepository.findByDeletedTrue();
    }

    // Restore soft deleted books
    public Book restoreBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not Found"));

        if (!book.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book is not deleted");
        }

        book.setDeleted(false);
        return bookRepository.save(book);
    }

    // Get all tags
    public List<BookTag> getAllTags() {
        return Arrays.asList(BookTag.values());
    }

    // Gets books by tags
    public List<Book> getBooksByTag(BookTag tag) {
        return bookRepository.findByDeletedFalseAndTag(tag);
    }

    // Gets books by tags
    public List<Book> getBooksByTags(List<BookTag> tags) {
        return bookRepository.findByDeletedFalseAndTagsIn(tags);
    }

    // Adds tags to book
    public Book addTagToBook(Long bookId, BookTag tag) {
        Book book = getBookById(bookId);
        book.addTag(tag);
        return bookRepository.save(book);
    }

    // Remove tags from book
    public Book removeTagFromBook(Long bookId, BookTag tag) {
        Book book = getBookById(bookId);
        book.removeTag(tag);
        return bookRepository.save(book);
    }

    // Set tags to books
    public Book setBookTags(Long bookId, List<BookTag> tags) {
        Book book = getBookById(bookId);
        book.getTags().clear();
        book.getTags().addAll(tags);
        return bookRepository.save(book);
    }

    // Update total and available book copies
    @Transactional
    public Book updateBookCopies(Long bookId, int newTotalCopies) {
        Book book = bookRepository.findById(bookId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,"Book Not Found"));

        if (newTotalCopies < 0) {
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total Copies cannot be negative");
        }
        int borrowedCopies = book.getTotalCopies() - book.getAvailableCopies();

        if (newTotalCopies < borrowedCopies) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot set total copies below currently borrowed copies");
        }

        int newAvailableCopies = newTotalCopies - borrowedCopies;

        book.setTotalCopies(newTotalCopies);
        book.setAvailableCopies(newAvailableCopies);

        return bookRepository.save(book);
    }
}
