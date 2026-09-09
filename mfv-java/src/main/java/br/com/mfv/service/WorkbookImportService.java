package br.com.mfv.service;

import br.com.mfv.persistence.*; import com.fasterxml.jackson.databind.ObjectMapper; import org.apache.poi.ss.usermodel.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.multipart.MultipartFile; import java.io.*; import java.nio.file.*; import java.util.*;

@Service public class WorkbookImportService {
 private final BaseRowRepository rows; private final BaseVersionRepository versions; private final ObjectMapper mapper=new ObjectMapper();
 public WorkbookImportService(BaseRowRepository r,BaseVersionRepository v){rows=r;versions=v;}
 @Transactional public Map<String,Object> importWorkbook(MultipartFile file) throws Exception {
  if(file==null||file.isEmpty()) throw new IllegalArgumentException("Arquivo XLSX vazio");
  Files.createDirectories(Paths.get("data")); file.transferTo(Paths.get("data/REFRIGERACAO.xlsx"));
  Map<String,Integer> counts=new LinkedHashMap<>(); long total=0;
  try(InputStream in=Files.newInputStream(Paths.get("data/REFRIGERACAO.xlsx")); Workbook wb=WorkbookFactory.create(in)){
   for(Sheet s:wb){ rows.deleteBySheetName(s.getSheetName()); List<String> headers=headerNames(s); int count=0;
    for(Row r:s){ if(r.getRowNum()==0||isEmpty(r)) continue; Map<String,String> data=new LinkedHashMap<>(); for(int c=0;c<headers.size();c++) data.put(headers.get(c),cell(r.getCell(c))); rows.save(new BaseRow(s.getSheetName(),r.getRowNum()+1,mapper.writeValueAsString(data))); count++; }
    counts.put(s.getSheetName(),count); total+=count;
   }
  }
  String version="BASE "+String.format("%04d",versions.count()+1)+" — REAL PCM"; versions.save(new BaseVersion(version,counts.size(),total));
  return Map.of("status","OK","version",version,"sheets",counts.size(),"rows",total,"recordsBySheet",counts);
 }
 private List<String> headerNames(Sheet s){Row h=s.getRow(0); List<String> out=new ArrayList<>(); if(h==null)return out; for(int i=0;i<h.getLastCellNum();i++){String v=cell(h.getCell(i)).trim(); out.add(v.isBlank()?"COL_"+i:v); } return out;}
 private boolean isEmpty(Row r){for(Cell c:r)if(!cell(c).isBlank())return false;return true;}
 private String cell(Cell c){if(c==null)return ""; DataFormatter f=new DataFormatter(); return f.formatCellValue(c).trim();}
}
