package com.msis.app.domain.repository;

import com.msis.app.domain.dto.ModuleBasicInfoDTO;
import com.msis.app.domain.entity.Module;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    /**
     * Finds a module on the database by its id.
     *
     * @param moduleId the id of a module
     * @return the module found or an empty <i>Optional</i>
     */
    Optional<Module> findByModuleId(String moduleId);

    /**
     * Finds a module on the database by its id.
     *
     * @param the id of a module
     * @return the module found or an empty <i>Optional</i>
     */
    Optional<Module> findById(Long moduleId);

    /**
     * Finds all of the modules on the database.
     *
     * @return the modules found or an empty list
     */
    @Cacheable("allModules")
    List<Module> findAll();

    /**
     * Finds all of the modules on the database with only their basic information.
     *
     * @return the modules found with only their basic information or an empty list
     */
    @Query(value = "SELECT new com.msis.app.domain.dto.ModuleBasicInfoDTO(m.id, m.moduleId, m.name, m.numOfCredits, m.numOfFeeCredits, m.weight, m.createdDate) FROM Module m")
    @Cacheable("allModulesWithBasicInfo")
    List<ModuleBasicInfoDTO> findAllWithBasicInfo();

    /**
     * Saves a module on the database.
     *
     * @param module the module that needs to be saved
     * @return the saved module
     */
    @Override
    @CacheEvict(value = {"allModules", "allModulesWithBasicInfo"}, allEntries = true)
    Module save(Module module);
}
