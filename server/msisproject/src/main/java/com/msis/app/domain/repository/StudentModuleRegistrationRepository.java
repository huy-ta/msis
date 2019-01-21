package com.msis.app.domain.repository;

import com.msis.app.domain.entity.StudentModuleRegistration;
import com.msis.app.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentModuleRegistrationRepository extends JpaRepository<StudentModuleRegistration, Long> {
    List<StudentModuleRegistration> findByTermIdAndUserId(Long termId, Long userId);

    List<StudentModuleRegistration> findByUser(User user);
}
