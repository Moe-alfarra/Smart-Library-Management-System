package com.moeAlfarra.Smart_Library_Management_System.controller;

import com.moeAlfarra.Smart_Library_Management_System.entity.Book;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookCategory;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookTag;
import com.moeAlfarra.Smart_Library_Management_System.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admins can add books
    public Book createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can soft delete books
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can permanently delete books
    public ResponseEntity<Void> permanentlyDeleteBook(@PathVariable Long id) {
        bookService.permanentlyDeleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/id/{id}") // All users can get book by Id
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @GetMapping("/isbn/{isbn}") // All users can get book by ISBN
    public Book getBookByIsbn(@PathVariable String isbn) {
        return bookService.getBookByIsbn(isbn);
    }

    @GetMapping("/categories") // All users can get categories
    public BookCategory[] getAllCategories() {
        return BookCategory.values();
    }
    @GetMapping("/category/{category}") // All users can get book by category
    public List<Book> getBookByCategory(@PathVariable BookCategory category) {
        return bookService.getBooksByCategory(category);
    }

    @PutMapping("/{bookId}/category/{category}")
    @PreAuthorize("hasRole('ADMIN')") // Only admmin can update categories for books
    public Book updateBookCategory(@PathVariable Long bookId, @PathVariable BookCategory category) {
        return bookService.updateBookCategory(bookId, category);
    }

    @GetMapping("/count-test")
    public long countTest() {
        long start = System.currentTimeMillis();
        long count = bookService.getBooksCount();
        long end = System.currentTimeMillis();
        System.out.println("COUNT TEST TIME: " + (end - start) + " ms");
        return count;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        long start = System.currentTimeMillis();
        List<Book> books = bookService.getAllBooks();
        long end = System.currentTimeMillis();
        System.out.println("TEST SIMPLE TIME: " + (end - start) + " ms");
        return books;
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can get deleted books
    public List<Book> getDeletedBooks() {
        return bookService.getDeletedBooks();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can restore books
    public ResponseEntity<Book> restoreBook(@PathVariable Long id) {
        Book restoredBook = bookService.restoreBook(id);
        return ResponseEntity.ok(restoredBook);
    }

    @GetMapping("/tags") // All users can get all tags
    public List<BookTag> getAllTags() {
        return bookService.getAllTags();
    }

    @GetMapping("/tag/{tag}") // All users can get books by tags
    public List<Book> getBooksByTag(@PathVariable BookTag tag) {
        return bookService.getBooksByTag(tag);
    }

    @PostMapping("/{bookId}/tags/{tag}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can add tags to books
    public Book addTagToBook(@PathVariable Long bookId, @PathVariable BookTag tag) {
        return bookService.addTagToBook(bookId, tag);
    }

    @DeleteMapping("/{bookId}/tags/{tag}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can delete tags from books
    public Book removeTagFromBook(@PathVariable Long bookId, @PathVariable BookTag tag) {
        return bookService.removeTagFromBook(bookId, tag);
    }

    @PutMapping("/{bookId}/tags")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can set tags to books
    public Book setBookTags(@PathVariable Long bookId, @RequestBody List<BookTag> tags) {
        return bookService.setBookTags(bookId, tags);
    }

    @PutMapping("/{bookId}/copies")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can update book copies in system
    public Book updateBookCopies(@PathVariable Long bookId, @RequestBody Map<String, Integer> request) {
        return bookService.updateBookCopies(bookId, request.get("totalCopies"));
    }
}
