package com.example.flower_shop.exception;
import java.util.NoSuchElementException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
@ExceptionHandler(Exception.class)
public ResponseEntity<String> handleAll(Exception ex) {
    return ResponseEntity
            .internalServerError()
            .body("Something went wrong: " + ex.getMessage());
}//Global fallback i kap kejt errorat
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<String> handleRuntime(RuntimeException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
}//bad request 
@ExceptionHandler(NoSuchElementException.class)
public ResponseEntity<String> handleNotFound(NoSuchElementException ex) {
    return ResponseEntity.status(404).body("Not found");
}//not found 404
}