package com.msis.app.domain.repository;

import com.msis.app.domain.entity.Role;
import com.msis.app.domain.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Finds a role on the database by its name.
     *
     * @param roleName the name of a role
     * @return the role found or an empty <i>Optional</i>
     */
    Optional<Role> findByName(RoleName roleName);
}
