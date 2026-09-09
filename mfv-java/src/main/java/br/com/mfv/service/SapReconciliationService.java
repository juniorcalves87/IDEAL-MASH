package br.com.mfv.service;

import br.com.mfv.persistence.*; import com.fasterxml.jackson.core.type.TypeReference; import com.fasterxml.jackson.databind.ObjectMapper; import org.springframework.stereotype.Service; import java.util.*;

@Service public class SapReconciliationService {
 private final BaseRowRepository repo; private final ObjectMapper mapper=new ObjectMapper();
 public SapReconciliationService(BaseRowRepository repo){this.repo=repo;}
 public Map<String,Object> reconcile(){
  List<Map<String,String>> iw=read("IW38"), ip=read("IP24"); Set<String> iwKeys=keys(iw), ipKeys=keys(ip); Set<String> common=new HashSet<>(iwKeys); common.retainAll(ipKeys);
  List<String> candidates=new ArrayList<>(common); candidates.sort(Comparator.comparingInt(this::score).reversed()); String key=candidates.isEmpty()?null:candidates.get(0);
  if(key==null)return Map.of("status","SEM_CHAVE_COMUM","iw38",iw.size(),"ip24",ip.size());
  Set<String> a=values(iw,key), b=values(ip,key); Set<String> matched=new HashSet<>(a); matched.retainAll(b); Set<String> onlyIw=new HashSet<>(a); onlyIw.removeAll(b); Set<String> onlyIp=new HashSet<>(b); onlyIp.removeAll(a);
  return Map.of("status","OK","chave",key,"iw38",iw.size(),"ip24",ip.size(),"ordensComuns",matched.size(),"somenteIW38",onlyIw.size(),"somenteIP24",onlyIp.size(),"coberturaIP24PorIW38",a.isEmpty()?0.0:(matched.size()*100.0/a.size()));
 }
 private int score(String s){String x=s.toUpperCase(Locale.ROOT); return x.contains("ORDEM")?100:x.contains("ORDER")?90:x.contains("AUFNR")?95:x.contains("NOTA")?80:x.contains("NUM")?30:1;}
 private List<Map<String,String>> read(String sheet){List<Map<String,String>> out=new ArrayList<>(); for(BaseRow r:repo.findTop5000BySheetNameOrderByRowNumberAsc(sheet)){try{out.add(mapper.readValue(r.getDataJson(),new TypeReference<>(){}));}catch(Exception ignored){}} return out;}
 private Set<String> keys(List<Map<String,String>> data){Set<String>s=new HashSet<>();for(var m:data)s.addAll(m.keySet());return s;}
 private Set<String> values(List<Map<String,String>> data,String key){Set<String>s=new HashSet<>();for(var m:data){String v=m.get(key);if(v!=null&&!v.isBlank())s.add(v.trim());}return s;}
}
