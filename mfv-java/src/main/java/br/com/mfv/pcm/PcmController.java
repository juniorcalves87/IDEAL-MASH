package br.com.mfv.pcm;

import org.springframework.web.bind.annotation.*;
import java.time.Year;
import java.util.Map;

@RestController
@RequestMapping("/api/pcm")
public class PcmController {
  private final RealPcmEngineService engine;
  public PcmController(RealPcmEngineService engine) { this.engine = engine; }

  @GetMapping("/mapa-52-semanas")
  public Map<String,Object> mapa52(@RequestParam(defaultValue="2026") int year) {
    if (year < 2000 || year > 2100) throw new IllegalArgumentException("Ano fora do intervalo permitido");
    return engine.build(year);
  }

  @GetMapping("/diagnostico")
  public Map<String,Object> diagnostico() { return engine.build(Year.now().getValue()); }
}
