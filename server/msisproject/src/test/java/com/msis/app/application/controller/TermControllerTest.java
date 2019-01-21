package com.msis.app.application.controller;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.msis.app.application.payload.request.CreateTermRequest;
import com.msis.app.domain.entity.Term;
import com.msis.app.domain.entity.TermStatus;
import com.msis.app.domain.service.TermService;

@TestInstance(Lifecycle.PER_CLASS)
public class TermControllerTest {
	
	private static final String BASE_URL = "/api/terms";

	@InjectMocks
	TermController termController;
	
	@Mock
	TermService termServiceMock;
	
	CreateTermRequest createTermRequest;
	
	private MockMvc mockMvc;
	
	private List<Term> mockTerms;
	
	public String convertObjectToJSON(Object requestPayload) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(requestPayload);
    }
	
	@BeforeAll
	public void setUpBeforeAllTests() {
		createTermRequest = new CreateTermRequest();
		mockTerms = new ArrayList<>();
		
		Term termOne = new Term();
		termOne.setId(new Long(1));
		termOne.setTermId("20172");
		termOne.setStatus(TermStatus.FINISHED);
		
		Term termTwo = new Term();
		termOne.setId(new Long(2));
		termOne.setTermId("20181");
		termOne.setStatus(TermStatus.ONGOING);
		
		Term termThree = new Term();
		termOne.setId(new Long(3));
		termOne.setTermId("20182");
		termOne.setStatus(TermStatus.ABOUT_TO_START);
		
		Term termFour = new Term();
		termOne.setId(new Long(4));
		termOne.setTermId("20183");
		termOne.setStatus(TermStatus.MODULES_REGISTERING);
		
		mockTerms.add(termOne);
		mockTerms.add(termTwo);
		mockTerms.add(termThree);
		mockTerms.add(termFour);
	}
	
	@BeforeEach
	public void setUpBeforeEachTest() {
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(termController).build();
		
		createTermRequest.setTermId("20191");
		createTermRequest.setStatus("ABOUT_TO_START");
	}
	
	@Test
	public void createTermTest() throws Exception {
		String url = BASE_URL;
		String requestJson = convertObjectToJSON(createTermRequest);
		
		mockMvc.perform(
                post(url).contentType(MediaType.APPLICATION_JSON_UTF8).content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Term created successfully.")))
                .andReturn();

        verify(termServiceMock).createTerm(
        		createTermRequest.getTermId(), 
        		createTermRequest.getStatus()
        );
	}
	
	

}
