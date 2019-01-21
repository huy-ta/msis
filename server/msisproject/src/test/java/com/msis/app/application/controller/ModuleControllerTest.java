package com.msis.app.application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.msis.app.application.payload.request.CreateModuleRequest;
import com.msis.app.domain.entity.Module;
import com.msis.app.domain.service.ModuleService;
import org.json.JSONArray;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestInstance(Lifecycle.PER_CLASS)
public class ModuleControllerTest {
    private static final String BASE_URL = "/api/modules";

    @Mock
    ModuleService moduleServiceMock;

    @InjectMocks
    ModuleController moduleController;

    CreateModuleRequest createModuleRequest;

    private MockMvc mockMvc;

    private List<Module> mockModules;

    public String convertObjectToJSON(Object requestPayload) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(requestPayload);
    }

    @BeforeAll
    public void setUpBeforeAllTests() {
        createModuleRequest = new CreateModuleRequest();

        mockModules = new ArrayList<>();

        Module moduleOne = new Module();
        moduleOne.setId(new Long(1));
        moduleOne.setModuleId("IT4550");
        moduleOne.setName("Phát triển phần mềm chuyên nghiệp");
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
    }

    @BeforeEach
    public void setUpBeforeEachTest() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(moduleController).build();

        createModuleRequest.setModuleId("IT4440");
        createModuleRequest.setName("Tương tác Người-Máy");
        createModuleRequest.setNumOfCredits(3);
        createModuleRequest.setNumOfFeeCredits(4.0);
        createModuleRequest.setWeight(0.7);
        createModuleRequest.setPassRequisiteModuleIds(new HashSet<>());
        createModuleRequest.setReadRequisiteModuleIds(new HashSet<>());
        createModuleRequest.setCoRequisiteModuleIds(new HashSet<>());
    }

    @Test
    public void create_withoutRequisiteModules() throws Exception {
        String url = BASE_URL;
        String requestJson = convertObjectToJSON(createModuleRequest);

        mockMvc.perform(
                post(url).contentType(MediaType.APPLICATION_JSON_UTF8).content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Module created successfully without requisite modules.")))
                .andReturn();

        verify(moduleServiceMock).createModule(createModuleRequest.getModuleId(),
                createModuleRequest.getName(),
                createModuleRequest.getNumOfCredits(),
                createModuleRequest.getNumOfFeeCredits(),
                createModuleRequest.getWeight()
        );
    }

    public void create_withRequisiteModules(CreateModuleRequest whichCreateModuleRequest) throws Exception {
        String url = BASE_URL;
        String requestJson = convertObjectToJSON(whichCreateModuleRequest);

        mockMvc.perform(
                post(url).contentType(MediaType.APPLICATION_JSON_UTF8).content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Module created successfully.")))
                .andReturn();

        verify(moduleServiceMock).setRequisiteModules(whichCreateModuleRequest.getModuleId(),
                whichCreateModuleRequest.getCoRequisiteModuleIds(),
                whichCreateModuleRequest.getReadRequisiteModuleIds(),
                whichCreateModuleRequest.getPassRequisiteModuleIds()
        );

        verify(moduleServiceMock).createModule(whichCreateModuleRequest.getModuleId(),
                whichCreateModuleRequest.getName(),
                whichCreateModuleRequest.getNumOfCredits(),
                whichCreateModuleRequest.getNumOfFeeCredits(),
                whichCreateModuleRequest.getWeight()
        );
    }

    @Test
    public void create_withOnlyPassRequisiteModules() throws Exception {
        Set<String> passRequisiteModuleIds = new HashSet<>();
        passRequisiteModuleIds.add("IT3330");
        createModuleRequest.setPassRequisiteModuleIds(passRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withOnlyReadRequisiteModules() throws Exception {
        Set<String> readRequisiteModuleIds = new HashSet<>();
        readRequisiteModuleIds.add("IT1010");
        createModuleRequest.setReadRequisiteModuleIds(readRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withOnlyCoRequisiteModules() throws Exception {
        Set<String> coRequisiteModuleIds = new HashSet<>();
        coRequisiteModuleIds.add("IT4420");
        createModuleRequest.setCoRequisiteModuleIds(coRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withCoAndReadRequisiteModules() throws Exception {
        Set<String> coRequisiteModuleIds = new HashSet<>();
        coRequisiteModuleIds.add("IT4420");
        createModuleRequest.setCoRequisiteModuleIds(coRequisiteModuleIds);

        Set<String> readRequisiteModuleIds = new HashSet<>();
        readRequisiteModuleIds.add("IT4420");
        readRequisiteModuleIds.add("IT4410");
        createModuleRequest.setReadRequisiteModuleIds(readRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withCoAndPassRequisiteModules() throws Exception {
        Set<String> coRequisiteModuleIds = new HashSet<>();
        coRequisiteModuleIds.add("IT4420");
        createModuleRequest.setCoRequisiteModuleIds(coRequisiteModuleIds);

        Set<String> passRequisiteModuleIds = new HashSet<>();
        passRequisiteModuleIds.add("IT4420");
        passRequisiteModuleIds.add("IT4410");
        createModuleRequest.setPassRequisiteModuleIds(passRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withReadAndPassRequisiteModules() throws Exception {
        Set<String> readRequisiteModuleIds = new HashSet<>();
        readRequisiteModuleIds.add("IT4420");
        createModuleRequest.setReadRequisiteModuleIds(readRequisiteModuleIds);

        Set<String> passRequisiteModuleIds = new HashSet<>();
        passRequisiteModuleIds.add("IT4420");
        passRequisiteModuleIds.add("IT4410");
        createModuleRequest.setPassRequisiteModuleIds(passRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void create_withAllRequisiteModules() throws Exception {
        Set<String> coRequisiteModuleIds = new HashSet<>();
        coRequisiteModuleIds.add("IT4400");
        createModuleRequest.setCoRequisiteModuleIds(coRequisiteModuleIds);

        Set<String> readRequisiteModuleIds = new HashSet<>();
        readRequisiteModuleIds.add("IT4420");
        createModuleRequest.setReadRequisiteModuleIds(readRequisiteModuleIds);

        Set<String> passRequisiteModuleIds = new HashSet<>();
        passRequisiteModuleIds.add("IT4420");
        passRequisiteModuleIds.add("IT4410");
        createModuleRequest.setPassRequisiteModuleIds(passRequisiteModuleIds);

        create_withRequisiteModules(createModuleRequest);
    }

    @Test
    public void getAll_withModulesFound() throws Exception {
        String url = BASE_URL;

        when(moduleServiceMock.getAllModules()).thenReturn(mockModules);

        mockMvc.perform(get(url))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Successfully got all modules.")))
                .andExpect(jsonPath("$.details.modules", hasSize(2)))
                .andReturn();

        verify(moduleServiceMock).getAllModules();
    }

    @Test
    public void getAll_withNoModuleFound() throws Exception {
        String url = BASE_URL;

        when(moduleServiceMock.getAllModulesWithBasicInfo()).thenReturn(new ArrayList<>());

        mockMvc.perform(get(url))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("No module found.")))
                .andReturn();

        verify(moduleServiceMock).getAllModulesWithBasicInfo();
    }

    @Test
    public void getOne_withModuleFound() throws Exception {
        String requestModuleId = "IT4550";
        String url = String.format("%s/%s", BASE_URL, requestModuleId);

        Module mockModule = mockModules.get(0);

        when(moduleServiceMock.getModuleByModuleId(requestModuleId)).thenReturn(Optional.of(mockModule));

        mockMvc.perform(get(url))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Module found.")))
                .andExpect(jsonPath("$.details.module.moduleId", is(mockModule.getModuleId())))
                .andExpect(jsonPath("$.details.module.name", is(mockModule.getName())))
                .andReturn();

        verify(moduleServiceMock).getModuleByModuleId(requestModuleId);
    }

    @Test
    public void getOne_withNoModuleFound() throws Exception {
        String requestModuleId = "IT3737";
        String url = String.format("%s/%s", BASE_URL, requestModuleId);

        when(moduleServiceMock.getModuleByModuleId(requestModuleId)).thenReturn(Optional.empty());

        mockMvc.perform(get(url))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Module not found.")))
                .andExpect(jsonPath("$.errors.moduleId", is("No module found with current moduleId.")))
                .andReturn();

        verify(moduleServiceMock).getModuleByModuleId(requestModuleId);
    }
}