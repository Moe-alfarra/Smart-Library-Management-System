package com.moeAlfarra.Smart_Library_Management_System.service;

import com.moeAlfarra.Smart_Library_Management_System.entity.*;
import com.moeAlfarra.Smart_Library_Management_System.repository.BookRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.BorrowRecordRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.ReservationRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowRecordService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private final ReservationRepository reservationRepository;

    private static final int DEFAULT_BORROW_DAYS = 14; // borrow period in days
    private static final BigDecimal FINE_PER_DAY = BigDecimal.valueOf(2); // fine per late day
    private static final int MAX_RENEWALS = 2; // Maximum allowed renewals
    private static final int RENEWAL_DAYS = 14; // Renewal period in days
    private static final int MAX_BORROWED_LIMIT = 5; // Maximum allowed borrows
    public BorrowRecordService(UserRepository userRepository, BookRepository bookRepository,
                               BorrowRecordRepository borrowRecordRepository, ReservationRepository reservationRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
    }

    // Borrow book
    @Transactional
    public BorrowRecord borrowBook(Long user_id, Long book_id) {
        User user = userRepository.findById(user_id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Book book = bookRepository.findById(book_id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        if (user.getBorrowedBooksCount() >= MAX_BORROWED_LIMIT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Borrow limit reached (Max 5 books)");
        }
        borrowRecordRepository
                .findByUserIdAndBookIdAndStatus(user_id, book_id, BorrowStatus.BORROWED)
                .ifPresent(record -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already borrowed this book");
                });

        if (book.getAvailableCopies() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No available copies");
        }

        List<Reservation> queue = reservationRepository
                .findByBookAndStatusOrderByReservationDateAsc(book, ReservationStatus.ACTIVE);

        int availableCopies = book.getAvailableCopies();
        int reservedCopies = Math.min(queue.size(), availableCopies);
        Reservation matchedReservation = null;

        for (int i = 0; i < reservedCopies; i++) {
            Reservation reservation = queue.get(i);
            if (reservation.getUser().getId().equals(user_id)) {
                matchedReservation = reservation;
                break;
            }
        }

        boolean currentUserHasReservedPriority = matchedReservation != null;
        boolean allAvailableCopiesAreReserved = queue.size() >= availableCopies;

        if (allAvailableCopiesAreReserved && !currentUserHasReservedPriority) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This book is reserved by another user");
        }

        LocalDateTime now = LocalDateTime.now();

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(now);
        record.setDueDate(now.plusDays(DEFAULT_BORROW_DAYS));
        record.setStatus(BorrowStatus.BORROWED);
        record.setFineAmount(BigDecimal.ZERO);
        record.setRenewalCount(0);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        user.setBorrowedBooksCount(user.getBorrowedBooksCount() + 1);

        BorrowRecord savedRecord = borrowRecordRepository.save(record);

        if (matchedReservation != null) {
            matchedReservation.setStatus(ReservationStatus.FULFILLED);
            reservationRepository.save(matchedReservation);
        }

        bookRepository.save(book);
        userRepository.save(user);

        return savedRecord;
    }

    // Return book
    @Transactional
    public BorrowRecord returnBook(Long borrowId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (record.getStatus() != BorrowStatus.BORROWED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book already returned");
        }

        LocalDateTime now = LocalDateTime.now();
        record.setReturnDate(now);
        record.setStatus(BorrowStatus.RETURNED);

        // calculate late fine
        if (now.isAfter(record.getDueDate())) {
            long lateDays = now.toLocalDate().toEpochDay() - record.getDueDate().toLocalDate().toEpochDay();
            record.setFineAmount(FINE_PER_DAY.multiply(BigDecimal.valueOf(lateDays)));
        }

        // update book and user
        Book book = record.getBook();
        User user = record.getUser();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        user.setBorrowedBooksCount(user.getBorrowedBooksCount() - 1);

        bookRepository.save(book);
        userRepository.save(user);

        return borrowRecordRepository.save(record);
    }

    // Renew borrow record
    @Transactional
    public BorrowRecord renewBorrow(Long borrowId) {

        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (record.getStatus() != BorrowStatus.BORROWED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Returned books cannot be renewed");
        }

        if (record.getRenewalCount() >= MAX_RENEWALS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum renewals reached");
        }

        if (record.getDueDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Overdue books cannot be renewed");
        }

        List<Reservation> queue = reservationRepository
                .findByBookAndStatusOrderByReservationDateAsc(record.getBook(), ReservationStatus.ACTIVE);

        long reservationsByOtherUsers = queue.stream()
                .filter(reservation -> !reservation.getUser().getId().equals(record.getUser().getId()))
                .count();

        if (reservationsByOtherUsers > record.getBook().getAvailableCopies()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot renew because another user has reserved this book");
        }

        record.setDueDate(record.getDueDate().plusDays(14));
        record.setRenewalCount(record.getRenewalCount() + 1);

        return borrowRecordRepository.save(record);
    }

    // Get user borrow history
    public List<BorrowRecord> getUserBorrowHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return borrowRecordRepository.findByUserId(userId);
    }
}
