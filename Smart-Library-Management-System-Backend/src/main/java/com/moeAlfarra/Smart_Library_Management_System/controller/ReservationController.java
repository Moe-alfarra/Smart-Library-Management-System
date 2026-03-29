package com.moeAlfarra.Smart_Library_Management_System.controller;

import com.moeAlfarra.Smart_Library_Management_System.entity.Reservation;
import com.moeAlfarra.Smart_Library_Management_System.service.ReservationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')") // Only members can reserve books
    public Reservation reserveBook(@RequestBody Map<String, Long> request) {
        return reservationService.reserveBook(request.get("user_id"), request.get("book_id"));
    }

    @PutMapping("/{reservationId}/cancel")
    @PreAuthorize("hasRole('MEMBER') or hasRole('ADMIN')")
    public Reservation cancelReservation(@PathVariable Long reservationId) {
        return reservationService.cancelReservation(reservationId);
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or principal.id == #userId")
    public List<Reservation> getUserReservations(@PathVariable Long userId) {
        return reservationService.getUserReservations(userId);
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can view reservations for each book
    public List<Reservation> getBookReservations(@PathVariable Long bookId) {
        return reservationService.getBookReservations(bookId);
    }
}
