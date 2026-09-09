package br.com.mfv.pcm;
import org.junit.jupiter.api.Test; import java.time.*; import static org.junit.jupiter.api.Assertions.*;
class Week52Test { @Test void isoWeekIsStable(){var w=Week52.of(LocalDate.of(2026,9,9)); assertTrue(w.week()>=1&&w.week()<=53); assertEquals(DayOfWeek.MONDAY,w.start().getDayOfWeek()); assertEquals(DayOfWeek.SUNDAY,w.end().getDayOfWeek());} }
