package br.com.mfv.pcm;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.*;
import java.time.*;
import java.time.temporal.WeekFields;
import java.util.*;

@Service
public class RealPcmEngineService {
  private static final Path BASE = Paths.get("data/REFRIGERACAO.xlsx");
  private static final int NORMAL_CAPACITY = 4;
  private static final int EXCEPTION_CAPACITY = 6;

  public Map<String,Object> build(int year) {
    if (!Files.exists(BASE)) return Map.of("status","BASE_NAO_ENCONTRADA","arquivo",BASE.toString(),"year",year);
    try (InputStream in=Files.newInputStream(BASE); Workbook wb=WorkbookFactory.create(in)) {
      Set<String> excluded=readExcludedPlans(wb);
      List<Map<String,Object>> activities=readProgramming(wb,year,excluded);
      if (activities.isEmpty()) activities=generateFromIp24AndPlans(wb,year,excluded);
      return aggregate(year,activities,excluded.size(),wb.getSheet("Programação")!=null);
    } catch(Exception e) {
      return Map.of("status","ERRO_PROCESSAMENTO","year",year,"mensagem",e.getMessage());
    }
  }

  private List<Map<String,Object>> readProgramming(Workbook wb,int year,Set<String> excluded) {
    Sheet s=wb.getSheet("Programação"); List<Map<String,Object>> out=new ArrayList<>();
    if(s==null) return out;
    for(int i=9;i<=s.getLastRowNum();i++) {
      Row r=s.getRow(i); if(r==null) continue;
      String plan=txt(r,1), text=txt(r,2), freq=txt(r,3), team=txt(r,15), loc=txt(r,20), pmoc=txt(r,21);
      LocalDate date=date(r,6); if(plan.isBlank() || date==null || date.getYear()!=year || excluded.contains(plan)) continue;
      ActivityCategory cat=category(text);
      Set<DayOfWeek> allowed=PlanningRule.allowedDays(text+" "+loc);
      out.add(activity(plan,text,freq,date,team,loc,pmoc,cat,allowed.contains(date.getDayOfWeek()),"PROGRAMACAO"));
    }
    return out;
  }

  private List<Map<String,Object>> generateFromIp24AndPlans(Workbook wb,int year,Set<String> excluded) {
    Sheet ip=wb.getSheet("IP24"), plans=wb.getSheet("Planos ativos");
    Map<String,LocalDate> anchor=new HashMap<>();
    if(ip!=null) for(int i=4;i<=ip.getLastRowNum();i++) { Row r=ip.getRow(i); if(r==null) continue; String p=txt(r,1); LocalDate d=date(r,7); if(!p.isBlank()&&d!=null) anchor.putIfAbsent(p,d); }
    List<Map<String,Object>> out=new ArrayList<>(); if(plans==null) return out;
    for(int i=1;i<=plans.getLastRowNum();i++) {
      Row r=plans.getRow(i); if(r==null) continue; String p=txt(r,0), text=txt(r,2), freq=txt(r,7), loc=txt(r,12), team=txt(r,11);
      if(p.isBlank()||freq.isBlank()||freq.equalsIgnoreCase("FREQUENCIA")||excluded.contains(p)) continue;
      LocalDate base=anchor.get(p); if(base==null) continue;
      int days=intervalDays(freq); if(days<=0) continue;
      LocalDate d=base; while(d.isBefore(LocalDate.of(year,1,1))) d=d.plusDays(days);
      while(d.getYear()==year) {
        LocalDate target=snapToAllowed(d,text+" "+loc); if(target.getYear()==year)
          out.add(activity(p,text,freq,target,team,loc,"",category(text),PlanningRule.allowedDays(text+" "+loc).contains(target.getDayOfWeek()),"IP24+PLANOS_ATIVOS"));
        d=d.plusDays(days);
      }
    }
    return out;
  }

  private Map<String,Object> aggregate(int year,List<Map<String,Object>> activities,int excludedCount,boolean hasProgramming) {
    var wf=WeekFields.ISO; List<Map<String,Object>> weeks=new ArrayList<>(); Map<String,List<Map<String,Object>>> byWeek=new HashMap<>();
    for(Map<String,Object> a:activities) { LocalDate d=(LocalDate)a.get("dataPlanejada"); Week52 w=Week52.of(d); if(w.year()!=year||w.week()<1||w.week()>52) continue; byWeek.computeIfAbsent(String.format("S%02d",w.week()),k->new ArrayList<>()).add(a); }
    int totalConflicts=0,totalRuleConflicts=0,totalOrders=0; Map<String,Integer> daily=new HashMap<>();
    for(var e:byWeek.entrySet()) for(Map<String,Object> a:e.getValue()) { String k=a.get("dataPlanejada").toString(); daily.merge(k,1,Integer::sum); totalOrders++; if((Boolean)a.get("regraDiaOk") == false) totalRuleConflicts++; }
    for(int w=1;w<=52;w++) {
      LocalDate start=LocalDate.of(year,1,4).with(wf.weekBasedYear(),year).with(wf.weekOfWeekBasedYear(),w).with(wf.dayOfWeek(),1), end=start.plusDays(6);
      List<Map<String,Object>> acts=byWeek.getOrDefault(String.format("S%02d",w),List.of()); EnumMap<ActivityCategory,Integer> counts=new EnumMap<>(ActivityCategory.class); for(ActivityCategory c:ActivityCategory.values()) counts.put(c,0);
      Map<String,Integer> dayCounts=new TreeMap<>(); for(Map<String,Object>a:acts){String d=a.get("dataPlanejada").toString();dayCounts.merge(d,1,Integer::sum);counts.merge((ActivityCategory)a.get("categoria"),1,Integer::sum);}
      int peak=dayCounts.values().stream().mapToInt(Integer::intValue).max().orElse(0); boolean overloaded=peak>NORMAL_CAPACITY; boolean exception=peak<=EXCEPTION_CAPACITY && acts.stream().anyMatch(a->PlanningRule.exceptionAllowed((String)a.get("frequencia")));
      if(overloaded&&!exception) totalConflicts++;
      Map<String,Object> row=new LinkedHashMap<>(); row.put("week",String.format("S%02d",w)); row.put("weekNumber",w); row.put("start",start); row.put("end",end); row.put("categories",counts); row.put("orders",acts); row.put("plannedOrders",acts.size()); row.put("peakOrdersPerDay",peak); row.put("normalCapacity",NORMAL_CAPACITY); row.put("exceptionCapacity",EXCEPTION_CAPACITY); row.put("capacityStatus",!overloaded?"OK":exception?"EXCECAO_ATE_6":"SOBRECARGA"); row.put("plannedHH",null); row.put("availableHH",null); row.put("occupationPercent",null); row.put("hhStatus","SEM_TEMPO_HH_NA_BASE"); weeks.add(row);
    }
    Map<String,Object> summary=new LinkedHashMap<>(); summary.put("status","OK"); summary.put("year",year); summary.put("source",hasProgramming?"Programação + regras PCM":"IP24 + Planos ativos + regras PCM"); summary.put("orders",totalOrders); summary.put("excludedPlans",excludedCount); summary.put("weeks",52); summary.put("weeksWithOrders",byWeek.size()); summary.put("capacityConflicts",totalConflicts); summary.put("ruleDayConflicts",totalRuleConflicts); summary.put("dailyNormalCapacity",NORMAL_CAPACITY); summary.put("dailyExceptionCapacity",EXCEPTION_CAPACITY); summary.put("frequencies",List.of("1S","2S","5S","13S","26S","1A")); summary.put("rules",Map.of("AMV 01-04","MONDAY","AMV 05-08","TUESDAY","AMV 09/10/11/13","WEDNESDAY","TRECHOS/LASTROS/IC","THURSDAY/FRIDAY")); summary.put("weeksData",weeks); summary.put("generatedAt",LocalDateTime.now()); return summary;
  }

  private Set<String> readExcludedPlans(Workbook wb){ Set<String>s=new HashSet<>(); Sheet x=wb.getSheet("EXCLUSÃO"); if(x==null)return s; for(int i=1;i<=x.getLastRowNum();i++){Row r=x.getRow(i); if(r!=null){String p=txt(r,0); if(!p.isBlank())s.add(p);}} return s; }
  private Map<String,Object> activity(String p,String text,String f,LocalDate d,String team,String loc,String pmoc,ActivityCategory c,boolean rule,String source){ Map<String,Object>m=new LinkedHashMap<>();m.put("plano",p);m.put("texto",text);m.put("frequencia",f);m.put("dataPlanejada",d);m.put("semana",String.format("S%02d",Week52.of(d).week()));m.put("equipe",team);m.put("local",loc);m.put("pmoc",pmoc);m.put("categoria",c);m.put("regraDiaOk",rule);m.put("source",source);return m; }
  private ActivityCategory category(String v){String x=v==null?"":v.toUpperCase(); if(x.contains("SHUTDOWN")||x.contains("PARADA"))return ActivityCategory.SHUTDOWN; if(x.contains("CAPEX")||x.contains("PROJETO"))return ActivityCategory.PROJETO_CAPEX; if(x.contains("TERCEIR"))return ActivityCategory.TERCEIROS; if(x.contains("INSPE"))return ActivityCategory.INSPECAO; if(x.contains("PDM")||x.contains("PREDIT"))return ActivityCategory.PDM; if(x.contains("CORR"))return ActivityCategory.CORRETIVA_PLANEJADA; if(x.startsWith("PM ")||x.startsWith("PM("))return ActivityCategory.PM; if(x.startsWith("PR ")||x.startsWith("PR("))return ActivityCategory.PM; return ActivityCategory.PM; }
  private int intervalDays(String f){return switch(f.trim().toUpperCase()){case "1S"->7;case "2S"->14;case "5S"->35;case "13S"->91;case "26S"->182;case "1A"->365;default->-1;};}
  private LocalDate snapToAllowed(LocalDate d,String key){Set<DayOfWeek> ok=PlanningRule.allowedDays(key); if(ok.contains(d.getDayOfWeek()))return d; for(int i=1;i<=3;i++){LocalDate a=d.plusDays(i),b=d.minusDays(i);if(ok.contains(a.getDayOfWeek()))return a;if(ok.contains(b.getDayOfWeek()))return b;} return d;}
  private String txt(Row r,int c){Cell x=r.getCell(c);return x==null?"":new DataFormatter().formatCellValue(x).trim();}
  private LocalDate date(Row r,int c){Cell x=r.getCell(c);if(x==null)return null; if(x.getCellType()==CellType.NUMERIC&&DateUtil.isCellDateFormatted(x))return x.getLocalDateTimeCellValue().toLocalDate(); String v=new DataFormatter().formatCellValue(x).trim(); try{return LocalDate.parse(v);}catch(Exception e){return null;}}
}
