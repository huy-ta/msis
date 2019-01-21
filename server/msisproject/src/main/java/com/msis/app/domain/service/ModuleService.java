package com.msis.app.domain.service;

import com.msis.app.domain.dto.ModuleBasicInfoDTO;
import com.msis.app.domain.entity.Module;
import com.msis.app.domain.exception.EntityDuplicationException;
import com.msis.app.domain.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ModuleService {
    @Autowired
    ModuleRepository moduleRepository;

    private Clock clock;

    /**
     * Default constructor
     */
    public ModuleService() {
        this.clock = Clock.systemDefaultZone();
    }

    /**
     * Custom constructor with a clock, mainly used for testing purposes (with a fixed clock)
     *
     * @param clock the clock type used in LocalDateTime.now(clock)
     */
    public ModuleService(Clock clock) {
        this.clock = clock;
    }

    /**
     * Creates a new module on the database, based on the provided parameters.
     *
     * @param moduleId        the id of the module, must be unique
     * @param name            the name of the module
     * @param numOfCredits    the number of credits of the module, must be bigger than 0
     * @param numOfFeeCredits the number of fee credits of the module, must be bigger than 0
     * @param weight          the weight of the final grade, must be within (0, 1)
     * @throws EntityDuplicationException if the provided moduleId is not unique
     */
    public void createModule(String moduleId, String name, Integer numOfCredits, Double numOfFeeCredits, Double weight) {
        Module module = new Module();
        module.setModuleId(moduleId);
        module.setName(name);
        module.setNumOfCredits(numOfCredits);
        module.setNumOfFeeCredits(numOfFeeCredits);
        module.setWeight(weight);

        module.setCreatedDate(LocalDateTime.now(clock));

        try {
            moduleRepository.save(module);
        } catch (DataIntegrityViolationException exception) {
            throw new EntityDuplicationException("Module", "moduleId", moduleId);
        }
    }

    /**
     * Sets the requisite modules of a module on the database.
     *
     * @param moduleId               the id of the module
     * @param coRequisiteModuleIds   the ids of the co-requisite modules, can be left empty
     * @param readRequisiteModuleIds the ids of the read-requisite modules, can be left empty
     * @param passRequisiteModuleIds the ids of the pass-requisite modules, can be left empty
     */
    public void setRequisiteModules(String moduleId, Set<String> coRequisiteModuleIds, Set<String> readRequisiteModuleIds, Set<String> passRequisiteModuleIds) {
        Module module = moduleRepository.findByModuleId(moduleId).get();

        Set<Module> coRequisiteModules = new HashSet<>();
        coRequisiteModuleIds.forEach(coRequisiteModuleId -> {
            Optional<Module> coRequisiteModule = moduleRepository.findByModuleId(coRequisiteModuleId);
            coRequisiteModules.add(coRequisiteModule.get());
        });

        Set<Module> readRequisiteModules = new HashSet<>();
        readRequisiteModuleIds.forEach(readRequisiteModuleId -> {
            Optional<Module> readRequisiteModule = moduleRepository.findByModuleId(readRequisiteModuleId);
            readRequisiteModules.add(readRequisiteModule.get());
        });

        Set<Module> passRequisiteModules = new HashSet<>();
        passRequisiteModuleIds.forEach(passRequisiteModuleId -> {
            Optional<Module> passRequisiteModule = moduleRepository.findByModuleId(passRequisiteModuleId);
            passRequisiteModules.add(passRequisiteModule.get());
        });

        module.setCoRequisiteModules(coRequisiteModules);
        module.setReadRequisiteModules(readRequisiteModules);
        module.setPassRequisiteModules(passRequisiteModules);
        moduleRepository.save(module);
    }

    /**
     * Gets all modules existing on the database.
     *
     * @return list of all modules found or an empty list
     */
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    /**
     * Gets all modules existing on the database with only their basic information .
     *
     * @return list of all modules found with only their basic information or an empty list
     */
    public List<ModuleBasicInfoDTO> getAllModulesWithBasicInfo() {
        return moduleRepository.findAllWithBasicInfo();
    }

    /**
     * Gets a specific module on the database by its id.
     *
     * @param moduleId the id of the module
     * @return the module found or an empty <i>Optional</i>
     */
    public Optional<Module> getModuleByModuleId(String moduleId) {
        return moduleRepository.findByModuleId(moduleId);
    }

    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    public void resetSetRequisiteModules(String moduleId) {
        Module module = moduleRepository.findByModuleId(moduleId).get();
        Set<Module> coRequisiteModules = new HashSet<>();
        coRequisiteModules.add(null);
        Set<Module> readRequisiteModules = new HashSet<>();
        readRequisiteModules.add(null);
        Set<Module> passRequisiteModules = new HashSet<>();
        passRequisiteModules.add(null);
        module.setCoRequisiteModules(coRequisiteModules);
        module.setReadRequisiteModules(readRequisiteModules);
        module.setPassRequisiteModules(passRequisiteModules);
        moduleRepository.save(module);
    }

    public void updateModule(Long id, String name, Integer numOfCredits, Double numOfFeeCredits, Double weight) {
        Module module = moduleRepository.findById(id).get();
        module.setName(name);
        module.setNumOfCredits(numOfCredits);
        module.setNumOfFeeCredits(numOfFeeCredits);
        module.setWeight(weight);
        moduleRepository.save(module);
    }
}
