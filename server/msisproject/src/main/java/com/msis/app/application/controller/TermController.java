package com.msis.app.application.controller;

import com.msis.app.application.payload.request.CreateTermRequest;
import com.msis.app.application.payload.response.ApiDetailResponse;
import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.application.payload.response.ApiResponse;
import com.msis.app.domain.entity.Term;
import com.msis.app.domain.entity.TermStatus;
import com.msis.app.domain.repository.TermRepository;
import com.msis.app.domain.service.TermService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/terms")
public class TermController {

    @Autowired
    TermService termService;

    @Autowired
    TermRepository termRepository;

    @GetMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getAll() {
        List<Term> terms = termRepository.findAll();

        JSONObject details = new JSONObject();
        details.put("terms", terms);

        return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all terms.", details));
    }

    @GetMapping(value = "/{term-id}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getOne(@PathVariable("term-id") String termId) {
        Optional<Term> term = termRepository.findByTermId(termId);

        if (term.isPresent()) {
            JSONObject details = new JSONObject();
            details.put("term", term);

            return ResponseEntity.ok(new ApiDetailResponse(true, "Term found.", details));
        }

        JSONObject errors = new JSONObject();
        errors.put("moduleId", "No module found with current moduleId.");

        return new ResponseEntity<>(new ApiErrorResponse(false, "Module not found.", errors), HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/status", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getByStatus() {
        List<Term> terms = termRepository.findByStatus(TermStatus.MODULES_REGISTERING);

        JSONObject details = new JSONObject();
        details.put("terms", terms);

        return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all terms.", details));
    }

    @PostMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> create(@Valid @RequestBody CreateTermRequest createTermRequest) {
        if (termRepository.existsByTermId(createTermRequest.getTermId())) {
            JSONObject errors = new JSONObject();
            errors.put("termId", "Term is already taken.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Create Term failed.", errors),
                    HttpStatus.BAD_REQUEST);
        }

        termService.createTerm(createTermRequest.getTermId(), createTermRequest.getStatus());

        return ResponseEntity.ok(new ApiResponse(true, "Module created successfully."));
    }

    @PutMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> change(@Valid @RequestBody CreateTermRequest createTermRequest) {
        Optional<Term> term = termRepository.findByTermId(createTermRequest.getTermId());

        if (!term.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("termId", "Học kỳ không tồn tại.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        termService.changeTerm(createTermRequest.getTermId(), createTermRequest.getStatus());

        return ResponseEntity.ok(new ApiResponse(true, "Chỉnh sửa học kỳ thành công."));
    }
}