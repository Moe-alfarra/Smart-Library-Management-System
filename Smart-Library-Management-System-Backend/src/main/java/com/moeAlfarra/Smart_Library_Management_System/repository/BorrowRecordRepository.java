package com.moeAlfarra.Smart_Library_Management_System.repository;

import com.moeAlfarra.Smart_Library_Management_System.entity.BorrowRecord;
import com.moeAlfarra.Smart_Library_Management_System.entity.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserId(Long user_id);
    List<BorrowRecord> findByBookId(Long book_id);

    Optional<BorrowRecord> findByUserIdAndBookIdAndStatus(Long user_id, Long book_id, BorrowStatus status);

    long countByBookIdAndStatus(Long bookId, BorrowStatus status);


}
