package com.axora.backend;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

	private static final Logger logger = LoggerFactory.getLogger(BackendApplicationTests.class);

	@Test
	void contextLoads() {
		logger.info("Test context yükleniyor...");
	}

}
