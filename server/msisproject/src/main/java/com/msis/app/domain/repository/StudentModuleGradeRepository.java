package com.msis.app.domain.repository;

import com.msis.app.domain.entity.Module;
import com.msis.app.domain.entity.StudentModuleGrade;
import com.msis.app.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentModuleGradeRepository extends JpaRepository<StudentModuleGrade, Long> {
    Optional<StudentModuleGrade> findByModule(Module module);

    List<StudentModuleGrade> findAllByUser(User user);

    List<StudentModuleGrade> findAllById(Long userId);

    Optional<StudentModuleGrade> findByUserAndModule(User user, Module module);
}