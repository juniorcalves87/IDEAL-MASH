package br.com.mfv.persistence;

import jakarta.persistence.*; import java.time.LocalDateTime;

@Entity @Table(name="base_version")
public class BaseVersion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String version;
 @Column(nullable=false) private LocalDateTime importedAt;
 @Column(nullable=false) private Integer sheetCount;
 @Column(nullable=false) private Long rowCount;
 public BaseVersion(){} public BaseVersion(String version,int sheets,long rows){this.version=version;this.sheetCount=sheets;this.rowCount=rows;this.importedAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getVersion(){return version;} public LocalDateTime getImportedAt(){return importedAt;} public Integer getSheetCount(){return sheetCount;} public Long getRowCount(){return rowCount;}
}
