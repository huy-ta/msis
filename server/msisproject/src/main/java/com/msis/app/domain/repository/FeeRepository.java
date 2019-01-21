package com.msis.app.domain.repository;

import com.msis.app.domain.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author khaipv
 * @version 1.0
 * @since 2018-11-18
 */
@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    /**
     * Finds a fee on the database by its id.
     *
     * @param the id of a fee
     * @return the fee found or an empty <i>Optional</i>
     */
    Optional<Fee> findById(Long id);

}
