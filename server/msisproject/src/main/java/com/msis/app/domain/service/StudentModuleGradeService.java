package com.msis.app.domain.service;

import com.msis.app.domain.entity.Module;
import com.msis.app.domain.entity.StudentModuleGrade;
import com.msis.app.domain.entity.User;
import com.msis.app.domain.repository.StudentModuleGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentModuleGradeService {
    @Autowired
    StudentModuleGradeRepository studentModuleGradeRepository;

    public void createStudentModuleGrade(User user, Module module, Double midTermGrade, Double finalGrade) {
        StudentModuleGrade studentModuleGrade = new StudentModuleGrade();
        studentModuleGrade.setModule(module);
        studentModuleGrade.setUser(user);
        studentModuleGrade.setMidTermGrade(midTermGrade);
        studentModuleGrade.setFinalGrade(finalGrade);

        studentModuleGradeRepository.save(studentModuleGrade);
    }

    public List<StudentModuleGrade> getGradesByUserId(User user) {
        return studentModuleGradeRepository.findAllByUser(user);
    }

    public Optional<StudentModuleGrade> getStudentModuleGradeByUserAndModule(User user, Module module) {
        return studentModuleGradeRepository.findByUserAndModule(user, module);
    }

    public void updateStudentModuleGrade(StudentModuleGrade studentModuleGrade, Double midTermGrade, Double finalGrade) {
        if (midTermGrade != 0) {
            studentModuleGrade.setMidTermGrade(midTermGrade);
        }
        if (finalGrade != 0) {
            studentModuleGrade.setFinalGrade(finalGrade);
        }
        studentModuleGradeRepository.save(studentModuleGrade);
    }
}
