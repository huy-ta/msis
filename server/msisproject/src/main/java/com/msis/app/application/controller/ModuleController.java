package com.msis.app.application.controller;

import com.msis.app.application.payload.request.CreateModuleRequest;
import com.msis.app.application.payload.request.UpdateModuleRequest;
import com.msis.app.application.payload.response.ApiDetailResponse;
import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.application.payload.response.ApiResponse;
import com.msis.app.domain.dto.ModuleBasicInfoDTO;
import com.msis.app.domain.entity.Module;
import com.msis.app.domain.service.ModuleService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    @Autowired
    ModuleService moduleService;

    @PostMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> create(@Valid @RequestBody CreateModuleRequest createModuleRequest) {
        moduleService.createModule(
                createModuleRequest.getModuleId(),
                createModuleRequest.getName(),
                createModuleRequest.getNumOfCredits(),
                createModuleRequest.getNumOfFeeCredits(),
                createModuleRequest.getWeight()
        );

        if (!createModuleRequest.getCoRequisiteModuleIds().isEmpty()
                || !createModuleRequest.getReadRequisiteModuleIds().isEmpty()
                || !createModuleRequest.getPassRequisiteModuleIds().isEmpty()) {
            moduleService.setRequisiteModules(
                    createModuleRequest.getModuleId(),
                    createModuleRequest.getCoRequisiteModuleIds(),
                    createModuleRequest.getReadRequisiteModuleIds(),
                    createModuleRequest.getPassRequisiteModuleIds()
            );
        } else {
            return new ResponseEntity<>(new ApiResponse(true, "Module created successfully without requisite modules."), HttpStatus.CREATED);
        }

        return new ResponseEntity<>(new ApiResponse(true, "Module created successfully."), HttpStatus.CREATED);
    }

    @GetMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getAll() {
        List<ModuleBasicInfoDTO> modules = moduleService.getAllModulesWithBasicInfo();

        if (!modules.isEmpty()) {
            JSONObject details = new JSONObject();
            details.put("modules", modules);

            return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all modules.", details));
        }

        return new ResponseEntity<>(new ApiResponse(false, "No module found."), HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/{module-id}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getOne(@PathVariable("module-id") String moduleId) {
        Optional<Module> module = moduleService.getModuleByModuleId(moduleId);

        if (module.isPresent()) {
            JSONObject details = new JSONObject();
            details.put("module", module);
            return ResponseEntity.ok(new ApiDetailResponse(true, "Module found.", details));
        }

        JSONObject errors = new JSONObject();
        errors.put("moduleId", "No module found with current moduleId.");

        return new ResponseEntity<>(new ApiErrorResponse(false, "Module not found.", errors), HttpStatus.NOT_FOUND);
    }

    /**
     * Use to updated information module
     *
     * @param id                  is module code
     * @param updateModuleRequest information sent form client to server
     * @return api notifies updated module success or failed
     */
    @PutMapping(value = "/{id}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> updateModuleRequest(@PathVariable("id") Long id, @RequestBody UpdateModuleRequest updateModuleRequest) {
        Optional<Module> module = moduleService.getModuleById(id);

        if (module.isPresent()) {
            moduleService.updateModule(
                    id,
                    updateModuleRequest.getName(),
                    updateModuleRequest.getNumOfCredits(),
                    updateModuleRequest.getNumOfFeeCredits(),
                    updateModuleRequest.getWeight()
            );
            moduleService.resetSetRequisiteModules(updateModuleRequest.getModuleId());

            if (!updateModuleRequest.getCoRequisiteModuleIds().isEmpty()
                    || !updateModuleRequest.getReadRequisiteModuleIds().isEmpty()
                    || !updateModuleRequest.getPassRequisiteModuleIds().isEmpty()) {

                moduleService.setRequisiteModules(
                        updateModuleRequest.getModuleId(),
                        updateModuleRequest.getCoRequisiteModuleIds(),
                        updateModuleRequest.getReadRequisiteModuleIds(),
                        updateModuleRequest.getPassRequisiteModuleIds()

                );
                return ResponseEntity.ok(new ApiResponse(true, "Module updated successfully."));
            } else {

                return ResponseEntity.ok(new ApiResponse(true, "Module updated successfully without requisite modules."));
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
