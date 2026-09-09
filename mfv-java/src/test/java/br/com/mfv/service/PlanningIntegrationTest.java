package br.com.mfv.service;

import br.com.mfv.pcm.PlanningRule; import org.junit.jupiter.api.Test; import java.time.DayOfWeek; import java.util.Set; import static org.junit.jupiter.api.Assertions.*;
class PlanningIntegrationTest {
 @Test void operationalRulesAreConsistent(){assertEquals(Set.of(DayOfWeek.MONDAY),PlanningRule.allowedDays("AMV 01-04"));assertEquals(Set.of(DayOfWeek.TUESDAY),PlanningRule.allowedDays("AMV 05-08"));assertEquals(Set.of(DayOfWeek.WEDNESDAY),PlanningRule.allowedDays("AMV 09/10/11/13"));assertEquals(Set.of(DayOfWeek.THURSDAY,DayOfWeek.FRIDAY),PlanningRule.allowedDays("Trechos Lastros IC"));}
 @Test void capacityRules(){assertTrue(PlanningRule.normalDailyCapacity()<PlanningRule.exceptionCapacity());assertTrue(PlanningRule.exceptionAllowed("2S"));assertTrue(PlanningRule.exceptionAllowed("5S"));assertFalse(PlanningRule.exceptionAllowed("1S"));}
}
