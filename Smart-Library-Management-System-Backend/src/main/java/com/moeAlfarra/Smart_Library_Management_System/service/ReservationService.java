package com.moeAlfarra.Smart_Library_Management_System.service;

import com.moeAlfarra.Smart_Library_Management_System.entity.Book;
import com.moeAlfarra.Smart_Library_Management_System.entity.Reservation;
import com.moeAlfarra.Smart_Library_Management_System.entity.ReservationStatus;
import com.moeAlfarra.Smart_Library_Management_System.entity.User;
import com.moeAlfarra.Smart_Library_Management_System.repository.BookRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.ReservationRepository;
import com.moeAlfarra.Smart_Library_Management_System.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReservationService {

    private static final int MAX_ACTIVE_RESERVATIONS = 3; // Maximum allowed renewals
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;


    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository,
                              BookRepository bookRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    // Reserve unavailable book
    public Reservation reserveBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Book book = bookRepository.findById(bookId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        if (book.getAvailableCopies() > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book is available, no reservation required");
        }

        if (reservationRepository.findByUserAndBookAndStatus(user, book, ReservationStatus.ACTIVE).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already have an active reservation for this book");
        }
        long activeReservations = reservationRepository.countByUserAndStatus(user, ReservationStatus.ACTIVE);

        if (activeReservations >= MAX_ACTIVE_RESERVATIONS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation limit reached (Max 3 active reservations)");
        }


        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    // Cancel reservation
    public Reservation cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only Active reservation can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    // Get user reservations
    public List<Reservation> getUserReservations(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Reservation> userReservations = reservationRepository.findByUser(user);

        for (Reservation reservation : userReservations) {
            if (reservation.getStatus() == ReservationStatus.ACTIVE) {
                long ahead = reservationRepository.countReservationsAhead(
                        reservation.getBook(),
                        ReservationStatus.ACTIVE,
                        reservation.getReservationDate(),
                        reservation.getReservationId()
                );

                reservation.setQueuePosition((int) ahead + 1);
            } else {
                reservation.setQueuePosition(null);
            }
        }

        return userReservations;
    }

    // Get book reservations
    public List<Reservation> getBookReservations(Long bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        return reservationRepository.findByBookAndStatusOrderByReservationDateAsc(book, ReservationStatus.ACTIVE);
    }


}
