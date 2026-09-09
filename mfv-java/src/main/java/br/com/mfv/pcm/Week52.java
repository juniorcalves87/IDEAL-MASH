package br.com.mfv.pcm;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Locale;

public record Week52(int week, int year, LocalDate start, LocalDate end) {
  public static Week52 of(LocalDate date) {
    var wf = WeekFields.ISO;
    return new Week52(date.get(wf.weekOfWeekBasedYear()), date.get(wf.weekBasedYear()),
        date.with(wf.dayOfWeek(), 1), date.with(wf.dayOfWeek(), 7));
  }
}
