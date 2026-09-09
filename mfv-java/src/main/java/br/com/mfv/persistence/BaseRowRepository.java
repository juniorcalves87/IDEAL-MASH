package br.com.mfv.persistence;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface BaseRowRepository extends JpaRepository<BaseRow,Long>{ long countBySheetName(String sheetName); List<BaseRow> findTop5000BySheetNameOrderByRowNumberAsc(String sheetName); void deleteBySheetName(String sheetName); }
