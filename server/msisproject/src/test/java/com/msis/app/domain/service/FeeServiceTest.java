package com.msis.app.domain.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;


import com.msis.app.domain.entity.Fee;
import com.msis.app.domain.repository.FeeRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

@TestInstance(Lifecycle.PER_CLASS)
public class FeeServiceTest {
	@Mock
	FeeRepository feeRepositoryMock;

	@InjectMocks
	FeeService feeService ;

	private Fee mockFee;

@BeforeAll
void setUpBeforeAllTests() {
	mockFee = new Fee();
	mockFee.setId(new Long(1));
	mockFee.setAmount(410000.0);
	MockitoAnnotations.initMocks(this);
}



	@Test
	void getFeeById() {

		Optional<Fee> expectedFee = Optional.of(mockFee);
		feeRepositoryMock.findById(new Long(1));
		when(feeRepositoryMock.findById(mockFee.getId())).thenReturn(expectedFee);
		Optional<Fee> actualFee = feeService.getFeeById(mockFee.getId());
		assertEquals(expectedFee, actualFee);

	}

	@Test
	void getFeeByIdnotfound() {

		Optional<Fee> expectedFee = Optional.of(mockFee);
		feeRepositoryMock.findById(new Long(new Long(2)));
		when(feeRepositoryMock.findById(mockFee.getId())).thenReturn(expectedFee);
		Optional<Fee> actualFee = feeService.getFeeById(mockFee.getId());
		assertEquals(expectedFee, actualFee);

	}


}
