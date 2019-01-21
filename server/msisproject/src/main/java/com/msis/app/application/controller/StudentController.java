package com.msis.app.application.controller;

import com.msis.app.application.payload.request.CreateModuleGradeRequest;
import com.msis.app.application.payload.request.CreateStudentModuleRegistrationRequest;
import com.msis.app.application.payload.request.UpdateGradeRequest;
import com.msis.app.application.payload.response.ApiDetailResponse;
import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.application.payload.response.ApiResponse;
import com.msis.app.domain.entity.*;
import com.msis.app.domain.repository.*;
import com.msis.app.domain.service.*;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    @Autowired
    StudentModuleGradeService studentModuleGradeService;

    @Autowired
    StudentModuleGradeRepository studentModuleGradeRepository;

    @Autowired
    StudentModuleRegistrationService studentModuleRegistrationService;

    @Autowired
    StudentModuleRegistrationRepository studentModuleRegistrationRepository;

    @Autowired
    ModuleRepository moduleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TermRepository termRepository;

    @Autowired
    TermService termService;

    @Autowired
    FeeService feeService;

    @Autowired
    UserService userService;

    @Autowired
    ModuleService moduleService;

    @GetMapping("/student-module-grade")
    public List<StudentModuleGrade> retrieveAllStudentModuleGrade() {
        return studentModuleGradeRepository.findAll();
    }

    @GetMapping("/student-module-registration")
    public List<StudentModuleRegistration> retrieveAllStudentModuleRegistration() {
        return studentModuleRegistrationRepository.findAll();
    }

    @GetMapping("/{term-id}/{user-id}")
    public ResponseEntity<?> getModuleRegistration(@PathVariable("term-id") Long termId,
                                                   @PathVariable("user-id") Long userId) {
        List<StudentModuleRegistration> studentModuleRegistrations =
                studentModuleRegistrationRepository.findByTermIdAndUserId(termId, userId);

        JSONObject details = new JSONObject();
        details.put("studentModuleRegistrations", studentModuleRegistrations);

        return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all terms.", details));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        studentModuleRegistrationRepository.deleteById(id);
    }

    @PostMapping("/{username}/modules/{module-id}/grade")
    public ResponseEntity<?> createModuleGrade(@PathVariable("module-id") String moduleId,
                                               @PathVariable("username") String username,
                                               @Valid @RequestBody CreateModuleGradeRequest createModuleGradeRequest) {
        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("userId", "User not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        Optional<Module> module = moduleRepository.findByModuleId(moduleId);
        if (!module.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("moduleId", "Module not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        studentModuleGradeService.createStudentModuleGrade(
                user.get(),
                module.get(),
                createModuleGradeRequest.getMidTermGrade(),
                createModuleGradeRequest.getFinalGrade()
        );

        return ResponseEntity.ok(new ApiResponse(true, "Grade created successfully."));
    }

    @PostMapping("/{user-id}/register-modules")
    public ResponseEntity<?> createStudentRegisterModules(@PathVariable("user-id") Long id,
                                                          @Valid @RequestBody CreateStudentModuleRegistrationRequest createStudentModuleRegistrationRequest) {
        Optional<User> user = userRepository.findById(id);
        System.out.println(user);
        if (!user.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("userId", "User not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Tài khoản không tồn tại.", errors),
                    HttpStatus.NOT_FOUND);
        }

        Optional<Term> term = termRepository.findByTermId(createStudentModuleRegistrationRequest.getTermId());
        System.out.println(term);
        if (!term.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("termId", "Term not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        if (term.get().getStatus() != TermStatus.MODULES_REGISTERING) {
            JSONObject errors = new JSONObject();
            errors.put("termStatus", "Term not registing.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        Set<String> moduleIds = createStudentModuleRegistrationRequest.getModuleIds();

        for (String moduleId : moduleIds) {
            Optional<Module> module = moduleRepository.findByModuleId(moduleId);
            if (!module.isPresent()) {
                JSONObject errors = new JSONObject();
                errors.put("moduleId", "Module not found.");
                return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                        HttpStatus.NOT_FOUND);
            }

            studentModuleRegistrationService.createStudentModuleRegistration(user.get(), term.get(), module.get());
        }
        ;

        return ResponseEntity.ok(new ApiResponse(true, "Module registed successfully."));
    }

    @PostMapping("/{user-id}/{module-id}")
    public ResponseEntity<?> checkRequisiteModules(@PathVariable("user-id") Long id,
                                                   @PathVariable("module-id") String moduleId,
                                                   @Valid @RequestBody CreateStudentModuleRegistrationRequest createStudentModuleRegistrationRequest) {

        Optional<User> user = userRepository.findById(id);
        System.out.println(user);
        if (!user.isPresent()) {
            JSONObject errors = new JSONObject();
            System.out.println(errors);
            errors.put("userId", "Tài khoản không tồn tại.");
            System.out.println(errors);

            return new ResponseEntity<>(new ApiErrorResponse(false, "Tài khoản không tồn tại.", errors),
                    HttpStatus.NOT_FOUND);
        }

        Optional<Module> module = moduleRepository.findByModuleId(moduleId);
        System.out.println(module);
        if (!module.isPresent()) {
            JSONObject errors = new JSONObject();
            System.out.println(errors);
            errors.put("moduleId", "Học phần không tồn tại.");
            System.out.println(errors);
            return new ResponseEntity<>(new ApiErrorResponse(false, "Học phần không tồn tại.", errors),
                    HttpStatus.NOT_FOUND);
        }

        List<StudentModuleGrade> studentModuleGrades = studentModuleGradeRepository.findAllByUser(user.get());

        Long idTerm = termRepository.findByTermId(createStudentModuleRegistrationRequest.getTermId()).get().getId();
        List<StudentModuleRegistration> studentModuleRegistrations = studentModuleRegistrationRepository.findByTermIdAndUserId(idTerm, id);

        Set<Module> passRequisiteModules = module.get().getPassRequisiteModules();
        Set<Module> readRequisiteModules = module.get().getReadRequisiteModules();
        Set<Module> coRequisiteModules = module.get().getCoRequisiteModules();

        if (!studentModuleRegistrationService.checkPassRequisiteModules(module.get(), passRequisiteModules, studentModuleGrades)) {
            JSONObject errors = new JSONObject();
            System.out.println(errors);
            errors.put("moduleId", "Bạn không thể đăng ký học phần này vì chưa qua các học phần tiên quyết.");
            System.out.println(errors);
            return new ResponseEntity<>(new ApiErrorResponse(false, "Bạn không thể đăng ký học phần này vì chưa qua các học phần tiên quyết.", errors),
                    HttpStatus.NOT_FOUND);
        }

        if (!studentModuleRegistrationService.checkReadRequisiteModules(module.get(), readRequisiteModules, studentModuleGrades)) {
            JSONObject errors = new JSONObject();
            System.out.println(errors);
            errors.put("moduleId", "Bạn không thể đăng ký học phần này vì chưa qua các học phần trước.");
            System.out.println(errors);
            return new ResponseEntity<>(new ApiErrorResponse(false, "Bạn không thể đăng ký học phần này vì chưa qua các học phần trước.", errors),
                    HttpStatus.NOT_FOUND);
        }

        if (!studentModuleRegistrationService.checkCoRequisiteModules(module.get(), coRequisiteModules, createStudentModuleRegistrationRequest.getModuleIds())) {
            JSONObject errors = new JSONObject();
            System.out.println(errors);
            errors.put("moduleId", "Bạn không thể đăng ký học phần này vì chưa qua các học phần song hành.");
            System.out.println(errors);
            return new ResponseEntity<>(new ApiErrorResponse(false, "Bạn không thể đăng ký học phần này vì chưa qua các học phần song hành.", errors),
                    HttpStatus.NOT_FOUND);
        }

        if (!studentModuleRegistrationService.checkDuplicateModule(module.get(), studentModuleRegistrations)) {
            JSONObject errors = new JSONObject();
            errors.put("moduleId", "Học phần đã được đăng ký.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Học phần đã được đăng ký.", errors),
                    HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(new ApiResponse(true, "Bạn có thể đăng ký học phần này."));
    }

    /**
     * get term fee in status "ONGOING"
     *
     * @return API with term haves status "ONGOING" or API notifys "not fond"
     */
    @GetMapping(value = "/term", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getTermFee() {
        List<Term> terms = termService.getAllTerms();
        for (int i = 0; i < terms.size(); i++) {
            System.out.println(((terms.get(i)).getStatus().toString().equals("ONGOING")));
            if ((terms.get(i)).getStatus().toString().equals("ONGOING")) {

                JSONObject details = new JSONObject();
                Term term = terms.get(i);
                details.put("term", term);
                return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all term.", details));


            }
        }
        JSONObject errors = new JSONObject();
        errors.put("term", "No term find in ONGOING");

        return new ResponseEntity<>(new ApiErrorResponse(false, "Term not found.", errors), HttpStatus.NOT_FOUND);

    }

    /**
     * get information user form its user
     *
     * @param id is id of user
     * @return API details user or api notifys "not found"
     */
    @GetMapping(value = "/{id}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getOne(@PathVariable("id") Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            JSONObject details = new JSONObject();
            details.put("user", user);
            return ResponseEntity.ok(new ApiDetailResponse(true, "User found.", details));
        }

        JSONObject errors = new JSONObject();
        errors.put("userId", "No user found with current userId.");

        return new ResponseEntity<>(new ApiErrorResponse(false, "User not found.", errors), HttpStatus.NOT_FOUND);
    }

    /**
     * @return api have details one fee
     */
    @GetMapping(value = "/amount", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getOneAmount() {
        long id = 1L;
        Optional<Fee> fee = feeService.getFeeById(id);

        if (fee.isPresent()) {
            JSONObject details = new JSONObject();
            details.put("fee", fee);
            return ResponseEntity.ok(new ApiDetailResponse(true, "Fee found.", details));
        }

        JSONObject errors = new JSONObject();
        errors.put("userId", "No fee found with current feeId.");

        return new ResponseEntity<>(new ApiErrorResponse(false, "Fee not found.", errors), HttpStatus.NOT_FOUND);
    }

    /**
     * @param amount   is price of module
     * @param username is username of student
     * @param termId   is term
     * @return Api notifys details fee of api noiftys false
     */
    @GetMapping(value = "/{username}/fees/{term-id}/{amount}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getFee(@PathVariable("amount") Double amount,
                                    @PathVariable("username") String username,
                                    @PathVariable("term-id") String termId) {

        Long userId = ((userService.getUserByUsername(username)).get()).getId();
        int m = feeService.getFee(userId, termId);
        if (m != 0) {
            double m1 = m * amount;
            FeeReturn fee = new FeeReturn();
            fee.setCredits(m);
            fee.setTuition(m1);
            fee.setAmount(amount);
            JSONObject details = new JSONObject();
            details.put("amount", fee);
            return ResponseEntity.ok(new ApiDetailResponse(true, "Amount found.", details));
        } else {
            JSONObject errors = new JSONObject();
            errors.put("amount", "Students do not have tuition fees.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Fee not found.", errors), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * @return api reponse list student in system
     */
    @GetMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getAllStudents() {
        List<User> allUsers = userService.getAllUsers();
        List<User> students = new java.util.ArrayList<User>();
        int i = 0;
        for (User user : allUsers) {
            for (Role role : user.getRoles()) {
                if (role.getName().equals(RoleName.ROLE_STUDENT)) {
                    students.add(i, user);
                    i++;
                }
            }
        }
        //response data
        JSONObject details = new JSONObject();
        details.put("students", students);
        return new ResponseEntity<>(new ApiDetailResponse(true, "Successfully got all students.", details), HttpStatus.OK);
    }

    //API update grade for one module
    @PutMapping(value = "{student-id}/modules/{module-id}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> updateGradesForStudent(@Valid @RequestBody UpdateGradeRequest updateGradeRequest, @PathVariable("student-id") String studentId, @PathVariable("module-id") String moduleId) {
        Double midTermGrade = new Double(0);
        Double finalGrade = new Double(0);
        if (updateGradeRequest.getMidTermGrade() != null) {
            midTermGrade = Double.parseDouble(updateGradeRequest.getMidTermGrade());
        }
        if (updateGradeRequest.getFinalGrade() != null) {
            finalGrade = Double.parseDouble(updateGradeRequest.getFinalGrade());
        }

        Optional<User> foundStudent = userService.getUserByUsername(studentId);
        Optional<Module> foundModule = moduleService.getModuleByModuleId(moduleId);

        if (!foundStudent.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("studentId", String.format("Student not found with studentId '%s'.", studentId));
            return new ResponseEntity<>(new ApiErrorResponse(false, "Could not update grades.", errors), HttpStatus.BAD_REQUEST);
        }

        if (!foundModule.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("moduleId", String.format("Module not found with moduleId '%s'", moduleId));
            return new ResponseEntity<>(new ApiErrorResponse(false, "Could not update grades", errors), HttpStatus.BAD_REQUEST);
        }

        //get record in student_module_grades
        Optional<StudentModuleGrade> foundStudentModuleGrade = studentModuleGradeService.getStudentModuleGradeByUserAndModule(foundStudent.get(), foundModule.get());
        //check grade exist: If grade exists, system will update grade and If grade doesn't exist, system will create grade record
        if (!foundStudentModuleGrade.isPresent()) {
            studentModuleGradeService.createStudentModuleGrade(
                    foundStudent.get(),
                    foundModule.get(),
                    midTermGrade,
                    finalGrade);
        } else {
            studentModuleGradeService.updateStudentModuleGrade(
                    foundStudentModuleGrade.get(),
                    midTermGrade,
                    finalGrade);
        }

        return ResponseEntity.ok(new ApiResponse(true, "Successfully updated grade."));
    }

    // get all grade of modules by userid
    @GetMapping(value = "{student-id}/modules/grades", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getModuleGradesOfStudent(@PathVariable("student-id") String studentId) {
        Optional<User> foundStudent = userService.getUserByUsername(studentId);

        if (!foundStudent.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("studentId", String.format("Student not found with studentId '%s'.", studentId));
            return new ResponseEntity<>(new ApiErrorResponse(false, "Could not get grades.", errors), HttpStatus.BAD_REQUEST);
        }

        List<StudentModuleGrade> foundUserGrades = studentModuleGradeService.getGradesByUserId(foundStudent.get());

        JSONObject details = new JSONObject();
        details.put("student", foundStudent);
        details.put("grades", foundUserGrades);

        return new ResponseEntity<>(new ApiDetailResponse(true, "Successfully got student modules' grades.", details), HttpStatus.OK);
    }
}
