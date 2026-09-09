package br.com.mfv;

import br.com.mfv.pcm.AnnualMapService; import br.com.mfv.service.*; import org.springframework.boot.*; import org.springframework.boot.autoconfigure.SpringBootApplication; import org.springframework.web.bind.annotation.*; import java.util.*;
@SpringBootApplication public class MfvApplication {
 public static void main(String[] args){SpringApplication.run(MfvApplication.class,args);}
 @RestController @RequestMapping("/api") static class Api {
  private final AnnualMapService annual; private final WorkbookImportService importer; private final BaseQueryService base; private final SapReconciliationService sap;
  Api(AnnualMapService a,WorkbookImportService i,BaseQueryService b,SapReconciliationService s){annual=a;importer=i;base=b;sap=s;}
  @GetMapping("/health") Map<String,Object> health(){return Map.of("status","UP","app","MFV Java","version","1.1.0");}
  @GetMapping("/base") Map<String,Object> base(){return base.summary();}
  @PostMapping("/base/import") Map<String,Object> importBase(@RequestParam("file") org.springframework.web.multipart.MultipartFile file)throws Exception{return importer.importWorkbook(file);}
  @GetMapping("/pcm/mapa-52-semanas") Map<String,Object> mapa(@RequestParam(defaultValue="2026")int year){return annual.build(year);}
  @GetMapping("/sap/reconciliacao") Map<String,Object> reconciliacao(){return sap.reconcile();}
 }
}
