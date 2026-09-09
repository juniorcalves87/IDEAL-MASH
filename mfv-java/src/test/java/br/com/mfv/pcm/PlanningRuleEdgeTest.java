package br.com.mfv.pcm;
import org.junit.jupiter.api.Test; import java.time.DayOfWeek; import static org.junit.jupiter.api.Assertions.*;
class PlanningRuleEdgeTest { @Test void lowercaseAndNullAreSafe(){assertEquals(DayOfWeek.MONDAY,PlanningRule.allowedDays("amv 01").iterator().next());assertFalse(PlanningRule.exceptionAllowed(null));assertEquals(5,PlanningRule.allowedDays("AREA GERAL").size());} }
