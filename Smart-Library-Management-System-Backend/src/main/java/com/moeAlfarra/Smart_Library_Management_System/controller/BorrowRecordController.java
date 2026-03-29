package com.moeAlfarra.Smart_Library_Management_System.controller;

import com.moeAlfarra.Smart_Library_Management_System.entity.BorrowRecord;
import com.moeAlfarra.Smart_Library_Management_System.service.BorrowRecordService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow-records")
public class BorrowRecordController {

    private final BorrowRecordService borrowRecordService;

    public BorrowRecordController(BorrowRecordService borrowRecordService) {
        this.borrowRecordService = borrowRecordService;
    }

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')") // Only members can borrow books
    public BorrowRecord borrowBook(@RequestBody Map<String, Long> request) {
        return borrowRecordService.borrowBook(request.get("user_id"), request.get("book_id"));
    }

    @PutMapping("/{borrowId}/return")
    @PreAuthorize("hasRole('MEMBER') or hasRole('ADMIN')") // Only members can return their own books
    public BorrowRecord returnBook(@PathVariable Long borrowId) {
        return borrowRecordService.returnBook(borrowId);
    }

    @PutMapping("/{borrowId}/renew")
    @PreAuthorize("hasRole('MEMBER')") // Only members can renew borrow
    public BorrowRecord renewBorrow(@PathVariable Long borrowId) {
        return borrowRecordService.renewBorrow(borrowId);
    }
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or principal.id == #userId")
    // Members can see their own borrow history, admins can see anyone's
    public List<BorrowRecord> getUserBorrowHistory(@PathVariable Long userId) {
        return borrowRecordService.getUserBorrowHistory(userId);
    }
}
