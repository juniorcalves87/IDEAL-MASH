package br.com.mfv.service;

import br.com.mfv.persistence.*; import org.springframework.stereotype.Service; import java.util.*;

@Service public class BaseQueryService {
 private final BaseRowRepository rows; private final BaseVersionRepository versions;
 public BaseQueryService(BaseRowRepository r,BaseVersionRepository v){rows=r;versions=v;}
 public Map<String,Object> summary(){Map<String,Long> by=new LinkedHashMap<>(); for(String s:List.of("MODELO","DASH","Programação","IP24","IW38","Planos ativos","Tolerância","Turnos","PMOC BASE","Local","EXCLUSÃO","Planilha8")) by.put(s,rows.countBySheetName(s)); var v=versions.findTopByOrderByImportedAtDesc(); return Map.of("status",v.isPresent()?"OK":"SEM_IMPORTACAO","versao",v.map(BaseVersion::getVersion).orElse("-"),"totalRegistros",by.values().stream().mapToLong(Long::longValue).sum(),"registrosPorAba",by);}
}
