package com.moeAlfarra.Smart_Library_Management_System.repository;

import com.moeAlfarra.Smart_Library_Management_System.entity.Book;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookCategory;
import com.moeAlfarra.Smart_Library_Management_System.entity.BookTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Check if book is available by ISNB
    boolean existsByIsbn(String isbn);

    // Searches Book By ISBN
    Optional<Book> findByIsbn(String isbn);

    // Get Available Books
    List<Book> findByDeletedFalse();

    // Get Deleted Books
    List<Book> findByDeletedTrue();


    // Get books by category
    List<Book> findByDeletedFalseAndCategory(BookCategory category);

    // NEW: Tag filtering methods
    @Query("SELECT DISTINCT b FROM Book b JOIN b.tags t WHERE b.deleted = false AND t = :tag")
    List<Book> findByDeletedFalseAndTag(@Param("tag") BookTag tag);

    @Query("SELECT DISTINCT b FROM Book b JOIN b.tags t WHERE b.deleted = false AND t IN :tags")
    List<Book> findByDeletedFalseAndTagsIn(@Param("tags") List<BookTag> tags);


}
