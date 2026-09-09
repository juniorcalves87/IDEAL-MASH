package br.com.mfv.pcm;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.WeekFields;
import java.util.*;

@Service
public class AnnualMapService {
  public Map<String,Object> build(int year) {
    List<Map<String,Object>> weeks = new ArrayList<>();
    var wf = WeekFields.ISO;
    for (int w = 1; w <= 52; w++) {
      LocalDate monday = LocalDate.of(year, Month.JANUARY, 4)
          .with(wf.weekBasedYear(), year).with(wf.weekOfWeekBasedYear(), w).with(wf.dayOfWeek(), 1);
      Map<String,Object> row = new LinkedHashMap<>();
      row.put("week", String.format("S%02d", w));
      row.put("weekNumber", w);
      row.put("start", monday);
      row.put("end", monday.plusDays(6));
      EnumMap<ActivityCategory,Integer> counts = new EnumMap<>(ActivityCategory.class);
      for (ActivityCategory c : ActivityCategory.values()) counts.put(c, 0);
      row.put("categories", counts);
      row.put("plannedHH", 0.0);
      row.put("availableHH", 0.0);
      row.put("occupationPercent", 0.0);
      row.put("status", "SEM_DADOS");
      weeks.add(row);
    }
    return Map.of("year", year, "weeks", weeks, "source", "REAL_PCM", "generatedAt", LocalDate.now());
  }
}
