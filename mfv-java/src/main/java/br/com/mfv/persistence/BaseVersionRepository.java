package br.com.mfv.persistence;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface BaseVersionRepository extends JpaRepository<BaseVersion,Long>{ Optional<BaseVersion> findTopByOrderByImportedAtDesc(); }
