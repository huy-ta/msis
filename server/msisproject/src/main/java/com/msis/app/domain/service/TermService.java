package com.msis.app.domain.service;

import com.msis.app.domain.entity.Term;
import com.msis.app.domain.entity.TermStatus;
import com.msis.app.domain.exception.EntityDuplicationException;
import com.msis.app.domain.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TermService {

    @Autowired
    TermRepository termRepository;

    /**
     * Creates a new term on the database, based on the provided parameters.
     *
     * @param termId     the id of term, must include from 5 to 7 characters.
     * @param termStatus the status of term, will just be one of the following values "ABOUT_TO_START", "ONGOING", "FINISHED", or "MODULES_REGISTERING"
     * @throws EntityDuplicationException if the provided termId is not unique
     */
    public void createTerm(String termId, String termStatus) {
        Term term = new Term();
        term.setTermId(termId);
        term.setStatus(TermStatus.valueOf(termStatus));

        try {
            termRepository.save(term);
        } catch (DataIntegrityViolationException exception) {
            throw new EntityDuplicationException("Term", "termId", termId);
        }
    }

    /**
     * Change the status of a term.
     *
     * @param termId     the id of term which you want to change status
     * @param termStatus the new status of term
     * @throws EntityDuplicationException if the provided termId is not unique
     */
    public void changeTerm(String termId, String termStatus) {
        Optional<Term> term = termRepository.findByTermId(termId);

        term.get().setStatus(TermStatus.valueOf(termStatus));

        try {
            termRepository.save(term.get());
        } catch (DataIntegrityViolationException exception) {
            throw new EntityDuplicationException("Term", "termId", termId);
        }
    }

    /**
     * Get all terms that have ever existed.
     *
     * @return list of terms
     */
    public List<Term> getAllTerms() {
        return termRepository.findAll();
    }
}
