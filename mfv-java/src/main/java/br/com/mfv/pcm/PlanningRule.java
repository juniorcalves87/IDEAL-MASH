package br.com.mfv.pcm;

import java.time.DayOfWeek;
import java.util.Set;

public final class PlanningRule {
  private PlanningRule() {}

  public static Set<DayOfWeek> allowedDays(String equipmentOrArea) {
    String v = equipmentOrArea == null ? "" : equipmentOrArea.toUpperCase();
    if (v.matches(".*AMV\\s*0?[1-4].*")) return Set.of(DayOfWeek.MONDAY);
    if (v.matches(".*AMV\\s*0?[5-8].*")) return Set.of(DayOfWeek.TUESDAY);
    if (v.matches(".*AMV\\s*(09|10|11|13).*")) return Set.of(DayOfWeek.WEDNESDAY);
    if (v.contains("TRECHO") || v.contains("LASTRO") || v.matches(".*\\bIC\\b.*"))
      return Set.of(DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);
    return Set.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);
  }

  public static int normalDailyCapacity() { return 4; }
  public static int exceptionCapacity() { return 6; }

  public static boolean exceptionAllowed(String frequency) {
    if (frequency == null) return false;
    String f = frequency.trim().toUpperCase();
    return f.equals("2S") || f.equals("5S");
  }
}
