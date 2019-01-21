package com.msis.app.domain.service;

import com.msis.app.domain.entity.Module;
import com.msis.app.domain.exception.EntityDuplicationException;
import com.msis.app.domain.repository.ModuleRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@TestInstance(Lifecycle.PER_CLASS)
class ModuleServiceTest {
    private Clock clock = Clock.fixed(LocalDate.parse("2008-04-04").atStartOfDay(ZoneId.systemDefault()).toInstant(), ZoneId.systemDefault());

    @Mock
    ModuleRepository moduleRepositoryMock;

    @InjectMocks
    ModuleService moduleService = new ModuleService(clock);

    private Module mockModule;

    private List<Module> mockModules;

    @BeforeAll
    void setUpBeforeAllTests() {
        mockModule = new Module();
        mockModule.setModuleId("IT4550");
        mockModule.setName("Phát triển phần mềm chuyên nghiệp");
        mockModule.setNumOfCredits(3);
        mockModule.setNumOfFeeCredits(4.0);
        mockModule.setWeight(0.7);
        mockModule.setCreatedDate(LocalDateTime.now(clock));

        mockModules = new ArrayList<>();

        Module moduleOne = new Module();
        moduleOne.setId(new Long(1));
        moduleOne.setModuleId("IT3920");
        moduleOne.setName("Project II");
        moduleOne.setNumOfCredits(3);
        moduleOne.setNumOfFeeCredits(4.0);
        moduleOne.setWeight(0.7);

        Module moduleTwo = new Module();
        moduleTwo.setId(new Long(2));
        moduleTwo.setModuleId("IT4440");
        moduleTwo.setName("Tương tác Người-Máy");
        moduleTwo.setNumOfCredits(3);
        moduleTwo.setNumOfFeeCredits(4.0);
        moduleTwo.setWeight(0.7);

        mockModules.add(moduleOne);
        mockModules.add(moduleTwo);

        MockitoAnnotations.initMocks(this);
    }

    @BeforeEach
    void setUpBeforeEachTest() {
        reset(moduleRepositoryMock);
    }

    @Test
    void createModule_withUniqueModuleId() {
        moduleService.createModule(
                mockModule.getModuleId(),
                mockModule.getName(),
                mockModule.getNumOfCredits(),
                mockModule.getNumOfFeeCredits(),
                mockModule.getWeight()
        );

        verify(moduleRepositoryMock).save(mockModule);
    }

    @Test
    void createModule_withDuplicatedModuleId() {
        when(moduleRepositoryMock.save(mockModule)).thenThrow(DataIntegrityViolationException.class);

        try {
            moduleService.createModule(
                    mockModule.getModuleId(),
                    mockModule.getName(),
                    mockModule.getNumOfCredits(),
                    mockModule.getNumOfFeeCredits(),
                    mockModule.getWeight()
            );
            fail("An EntityDuplicationException is supposed to be thrown.");
        } catch (EntityDuplicationException expectedException) {
            assertEquals(String.format("Cannot save Module. Duplication field moduleId: %s.", mockModule.getModuleId()), expectedException.getMessage());
        }
    }

    @Test
    void getAllModules() {
        when(moduleRepositoryMock.findAll()).thenReturn(mockModules);

        List<Module> actualModules = moduleService.getAllModules();

        assertEquals(mockModules, actualModules);
    }

    @Test
    void getModuleByModuleId() {
        Optional<Module> expectedModule = Optional.of(mockModule);

        when(moduleRepositoryMock.findByModuleId(mockModule.getModuleId())).thenReturn(expectedModule);

        Optional<Module> actualModule = moduleService.getModuleByModuleId(mockModule.getModuleId());

        assertEquals(expectedModule, actualModule);
    }

    @Test
    void setRequisiteModules() {
        when(moduleRepositoryMock.findByModuleId(anyString())).thenReturn(Optional.of(mockModules.get(0)));

        Set<String> coRequisiteModuleIds = new HashSet<>();
        coRequisiteModuleIds.add("IT1111");
        coRequisiteModuleIds.add("IT2222");

        Set<String> readRequisiteModuleIds = new HashSet<>();
        readRequisiteModuleIds.add("IT3333");
        readRequisiteModuleIds.add("IT4444");
        readRequisiteModuleIds.add("IT5555");

        Set<String> passRequisiteModuleIds = new HashSet<>();
        passRequisiteModuleIds.add("IT6666");
        passRequisiteModuleIds.add("IT7777");

        moduleService.setRequisiteModules(mockModules.get(0).getModuleId(), coRequisiteModuleIds, readRequisiteModuleIds, passRequisiteModuleIds);

        verify(moduleRepositoryMock, times(8)).findByModuleId(anyString());

        verify(moduleRepositoryMock).save(mockModules.get(0));
    }
}