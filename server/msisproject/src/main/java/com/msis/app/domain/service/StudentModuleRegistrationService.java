package com.msis.app.domain.service;

import com.msis.app.domain.entity.*;
import com.msis.app.domain.repository.StudentModuleRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class StudentModuleRegistrationService {

    @Autowired
    StudentModuleRegistrationRepository studentModuleRegistrationRepository;

    /**
     * Creates a new modules registration of a student on the database.
     *
     * @param user   the student module registration
     * @param term   the open registration term
     * @param module the module registration
     */
    public void createStudentModuleRegistration(User user, Term term, Module module) {
        StudentModuleRegistration studentModuleRegistration = new StudentModuleRegistration();
        studentModuleRegistration.setUser(user);
        studentModuleRegistration.setTerm(term);
        studentModuleRegistration.setModule(module);

        studentModuleRegistrationRepository.save(studentModuleRegistration);
    }

    /**
     * Check the student has passed the requisite module of the module wants to register
     *
     * @param module               the module wants to register
     * @param passRequisiteModules the list of pass requisite module of module
     * @param studentModuleGrades  the list of module that student has learned
     * @return true if student has passed all modules in passRequisiteModules, false if student hasn't pass one of module in passRequisiteModules
     */
    public boolean checkPassRequisiteModules(Module module,
                                             Set<Module> passRequisiteModules,
                                             List<StudentModuleGrade> studentModuleGrades) {
        if (!passRequisiteModules.isEmpty()) {
            if (studentModuleGrades.isEmpty()) return false;

            for (Module passRequisiteModule : passRequisiteModules) {
                for (StudentModuleGrade studentModuleGrade : studentModuleGrades) {
                    if (!studentModuleGrade.getModule().equals(passRequisiteModule)) {
                        return false;
                    } else {
                        if (studentModuleGrade.getMidTermGrade() * (1.0 - passRequisiteModule.getWeight())
                                + studentModuleGrade.getFinalGrade() * passRequisiteModule.getWeight() < 3.0) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check the student has learned the pass requisite module of the module wants to register
     *
     * @param module               the module wants to register
     * @param readRequisiteModules the list of read-requisite module of module
     * @param studentModuleGrades  the list of module that student has learned
     * @return studentModuleGrades true if student has learned all modules in readRequisiteModules, false if student hasn't learned one of module in readRequisiteModules
     */
    public boolean checkReadRequisiteModules(Module module, Set<Module> readRequisiteModules,
                                             List<StudentModuleGrade> studentModuleGrades) {
        if (!readRequisiteModules.isEmpty()) {
            if (studentModuleGrades.isEmpty()) return false;

            for (Module readRequisiteModule : readRequisiteModules) {
                for (StudentModuleGrade studentModuleGrade : studentModuleGrades) {
                    if (!studentModuleGrade.getModule().equals(readRequisiteModule)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check the student has register co-requisite module of the module wants to register
     *
     * @param module             the module wants to register
     * @param coRequisiteModules the list of co-requisite module of module
     * @param moduleIds          the list of module id that student registers
     * @return true if student registers all modules in coRequisiteModules, false if student doesn't register one of module in coRequisiteModules
     */
    public boolean checkCoRequisiteModules(Module module, Set<Module> coRequisiteModules, Set<String> moduleIds) {
        if (!coRequisiteModules.isEmpty()) {
            for (Module coRequisiteModule : coRequisiteModules) {
                for (String moduleId : moduleIds) {
                    if (coRequisiteModule.getModuleId() != moduleId) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check if the student has registered for this module
     *
     * @param module                     the module wants to register
     * @param studentModuleRegistrations the list of module that student has registered
     * @return true if student has registered, false if student hasn't registered
     */
    public boolean checkDuplicateModule(Module module, List<StudentModuleRegistration> studentModuleRegistrations) {
        for (StudentModuleRegistration studentModuleRegistration : studentModuleRegistrations) {
            if (studentModuleRegistration.getModule().getId() == module.getId()) return false;
        }
        return true;
    }
}