package com.msis.app.domain.repository;

import com.msis.app.domain.entity.Term;
import com.msis.app.domain.entity.TermStatus;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {
    Optional<Term> findById(Long id);

    Optional<Term> findByTermId(String termId);

    Boolean existsByTermId(String termId);

    List<Term> findByStatus(TermStatus status);

    @Cacheable("allTerms")
    List<Term> findAll();

    @CacheEvict(value = "allTerms", allEntries = true)
    Term save(Term term);
}
