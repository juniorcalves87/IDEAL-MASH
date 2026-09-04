package br.com.mfv;

import org.apache.poi.ss.usermodel.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.io.InputStream;
import java.nio.file.*;
import java.util.*;

@SpringBootApplication
public class MfvApplication {
  public static void main(String[] args) { SpringApplication.run(MfvApplication.class, args); }

  @RestController
  @RequestMapping("/api")
  static class Api {
    @GetMapping("/health") Map<String,Object> health(){ return Map.of("status","UP","app","MFV Java"); }
    @GetMapping("/base") Map<String,Object> base() throws Exception {
      Path file=Paths.get("data/REFRIGERACAO.xlsx");
      if(!Files.exists(file)) return Map.of("status","BASE_NAO_ENCONTRADA");
      Map<String,Integer> rows=new LinkedHashMap<>();
      try(InputStream in=Files.newInputStream(file); Workbook wb=WorkbookFactory.create(in)){
        for(Sheet s:wb){ int n=0; for(Row r:s){ boolean ok=false; for(Cell c:r) if(c.getCellType()!=CellType.BLANK&&!c.toString().isBlank()){ok=true;break;} if(ok)n++; } rows.put(s.getSheetName(),Math.max(0,n-1)); }
        return Map.of("status","OK","arquivo",file.toString(),"abas",rows.size(),"registros",rows,"versao","BASE V1.0 — REAL PCM · PRODUÇÃO");
      }
    }
    @PostMapping("/base/import") Map<String,Object> importBase(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws Exception {
      Files.createDirectories(Paths.get("data")); Path target=Paths.get("data/REFRIGERACAO.xlsx"); file.transferTo(target); return base();
    }
  }
}
