package com.msis.app.domain.service;

import com.msis.app.domain.entity.Fee;
import com.msis.app.domain.entity.Module;
import com.msis.app.domain.entity.StudentModuleRegistration;
import com.msis.app.domain.entity.User;
import com.msis.app.domain.repository.FeeRepository;
import com.msis.app.domain.repository.ModuleRepository;
import com.msis.app.domain.repository.StudentModuleRegistrationRepository;
import com.msis.app.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeeService {
    @Autowired
    StudentModuleRegistrationRepository studentModuleRegistrationRepository;
    @Autowired
    ModuleRepository moduleRepository;
    @Autowired
    FeeRepository feeRepository;
    @Autowired
    UserRepository userRepository;

    /**
     * Get one fee on the database by its id
     *
     * @param Id
     * @return the fee found or an empty <i>Optional</i>
     */
    public Optional<Fee> getFeeById(Long Id) {
        return feeRepository.findById(Id);
    }

    /**
     * Get totals numofFeeCredits
     *
     * @param userId the id of user
     * @param termId is term name
     * @return totals numofFeeCredits if find sucess term status" ONGOING" or 0 if cant find
     */
    public int getFee(Long userId, String termId) {
        Optional<User> user = userRepository.findById(userId);
        int credits = 0;
        List<StudentModuleRegistration> allRegisteredModules = studentModuleRegistrationRepository.findByUser(user.get());
        if (allRegisteredModules.isEmpty()) {
            return -1;
        } else {
            for (int i = 0; i < allRegisteredModules.size(); i++) {
                if (((allRegisteredModules.get(i).getTerm().getTermId()).equals(termId))) {
                    Optional<Module> module = moduleRepository.findById(allRegisteredModules.get(i).getModule().getId());
                    if (module.isPresent()) {
                        Module module1 = module.get();
                        credits += module1.getNumOfFeeCredits();
                    }
                }
            }
            return credits;
        }
    }
}
