package br.com.mfv.persistence;
import org.junit.jupiter.api.Test; import static org.junit.jupiter.api.Assertions.*;
class BaseVersionTest { @Test void versionStoresImportMetadata(){var v=new BaseVersion("BASE 0001 — REAL PCM",12,100); assertEquals(12,v.getSheetCount()); assertEquals(100,v.getRowCount()); assertNotNull(v.getImportedAt());} }
