package com.msis.app.application.exception.handler;

import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.domain.exception.EntityDuplicationException;
import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;
import org.hibernate.Hibernate;
import org.json.simple.JSONObject;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex, final HttpHeaders headers, final HttpStatus status, final WebRequest request) {
        logger.info(ex.getClass().getName());

        JSONObject errors = new JSONObject();
        for (final FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        for (final ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            errors.put(error.getObjectName(), error.getDefaultMessage());
        }

        String message = ex.getMessage().length() > 30 ? "Validation failed." : ex.getMessage();
        final ApiErrorResponse apiErrorResponse = new ApiErrorResponse(false, message, errors);

        return handleExceptionInternal(ex, apiErrorResponse, headers, HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object> handleBindException(final BindException ex, final HttpHeaders headers, final HttpStatus status, final WebRequest request) {
        logger.info(ex.getClass().getName());

        JSONObject errors = new JSONObject();
        for (final FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        for (final ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            errors.put(error.getObjectName(), error.getDefaultMessage());
        }
        final ApiErrorResponse apiErrorResponse = new ApiErrorResponse(false, ex.getMessage(), errors);
        return handleExceptionInternal(ex, apiErrorResponse, headers, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ ConstraintViolationException.class })
    public ResponseEntity<Object> handleConstraintViolation(final ConstraintViolationException ex, final WebRequest request) {
        logger.info(ex.getClass().getName());

        JSONObject errors = new JSONObject();
        for (final ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.put(violation.getPropertyPath(), violation.getMessage());
        }

        String message = ex.getMessage().length() > 30 ? "Model constraints violated." : ex.getMessage();
        final ApiErrorResponse apiError = new ApiErrorResponse(false, message, errors);

        return new ResponseEntity<>(apiError, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ MySQLIntegrityConstraintViolationException.class })
    public ResponseEntity<Object> handleConstraintViolation(final MySQLIntegrityConstraintViolationException ex, final WebRequest request) {
        logger.info(ex.getClass().getName());

        JSONObject errors = new JSONObject();

        String message = ex.getMessage();
        final ApiErrorResponse apiError = new ApiErrorResponse(false, message, errors);

        return new ResponseEntity<>(apiError, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ EntityDuplicationException.class })
    public ResponseEntity<Object> handleEntityDuplication(final EntityDuplicationException ex) {
        logger.info(ex.getClass().getName());

        JSONObject errors = new JSONObject();
        errors.put(ex.getFieldName(), "Duplicated value: " + ex.getFieldValue() + ".");

        String message = ex.getMessage();
        final ApiErrorResponse apiError = new ApiErrorResponse(false, message, errors);

        return new ResponseEntity<>(apiError, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handleAll(final Exception ex, final WebRequest request) {
        logger.info(ex.getClass().getName());
        logger.error("error", ex);

        JSONObject errors = new JSONObject();
        errors.put("unknown", "Some unhandled exception occured on the backend side.");

        final ApiErrorResponse apiError = new ApiErrorResponse(false, ex.getMessage(), errors);
        return new ResponseEntity<>(apiError, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
