package com.moeAlfarra.Smart_Library_Management_System.repository;

import com.moeAlfarra.Smart_Library_Management_System.entity.Book;
import com.moeAlfarra.Smart_Library_Management_System.entity.Reservation;
import com.moeAlfarra.Smart_Library_Management_System.entity.ReservationStatus;
import com.moeAlfarra.Smart_Library_Management_System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserAndBookAndStatus(User user, Book book, ReservationStatus status);

    List<Reservation> findByBookAndStatusOrderByReservationDateAsc(Book book, ReservationStatus status);

    List<Reservation> findByUser(User user);

    long countByBookAndStatus(Book book, ReservationStatus status);

    long countByUserAndStatus(User user, ReservationStatus status);

    @Query("""
    SELECT COUNT(r) FROM Reservation r
    WHERE r.book = :book
      AND r.status = :status
      AND (
        r.reservationDate < :reservationDate
        OR (r.reservationDate = :reservationDate AND r.reservationId < :reservationId)
      )
""")
    long countReservationsAhead(
            @Param("book") Book book,
            @Param("status") ReservationStatus status,
            @Param("reservationDate") LocalDateTime reservationDate,
            @Param("reservationId") Long reservationId
    );
}
