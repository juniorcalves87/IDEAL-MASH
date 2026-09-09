package br.com.mfv.service;
import org.junit.jupiter.api.Test; import static org.junit.jupiter.api.Assertions.*;
class BaseQueryServiceTest { @Test void serviceExists(){assertNotNull(BaseQueryService.class); assertNotNull(SapReconciliationService.class);} }
