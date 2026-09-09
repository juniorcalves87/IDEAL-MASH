package br.com.mfv.pcm;

import org.junit.jupiter.api.Test; import java.time.LocalDate; import java.util.*; import static org.junit.jupiter.api.Assertions.*;
class AnnualMapServiceTest {
 @Test void buildsExactly52Weeks(){var r=new AnnualMapService().build(2026); assertEquals(52,((List<?>)r.get("weeks")).size()); assertEquals("S01",((Map<?,?>)((List<?>)r.get("weeks")).get(0)).get("week")); assertEquals("S52",((Map<?,?>)((List<?>)r.get("weeks")).get(51)).get("week"));}
}
