package br.com.mfv.pcm;

import org.junit.jupiter.api.Test;
import java.time.DayOfWeek;

import static org.junit.jupiter.api.Assertions.*;

class PlanningRuleTest {
  @Test void amvRules() {
    assertEquals(Set.of(DayOfWeek.MONDAY), PlanningRule.allowedDays("AMV 01"));
    assertEquals(Set.of(DayOfWeek.TUESDAY), PlanningRule.allowedDays("AMV 08"));
    assertEquals(Set.of(DayOfWeek.WEDNESDAY), PlanningRule.allowedDays("AMV 10"));
  }

  @Test void trechoRule() {
    assertEquals(Set.of(DayOfWeek.THURSDAY, DayOfWeek.FRIDAY), PlanningRule.allowedDays("TRECHO 01"));
    assertEquals(4, PlanningRule.normalDailyCapacity());
    assertEquals(6, PlanningRule.exceptionCapacity());
    assertTrue(PlanningRule.exceptionAllowed("2S"));
    assertTrue(PlanningRule.exceptionAllowed("5S"));
    assertFalse(PlanningRule.exceptionAllowed("1S"));
  }
}
