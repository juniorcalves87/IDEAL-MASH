package br.com.mfv.persistence;

import jakarta.persistence.*;

@Entity @Table(name="base_row", indexes={@Index(name="idx_base_sheet",columnList="sheetName")})
public class BaseRow {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,length=120) private String sheetName;
  @Column(nullable=false) private Integer rowNumber;
  @Lob @Column(nullable=false) private String dataJson;
  public BaseRow() {}
  public BaseRow(String sheetName,Integer rowNumber,String dataJson){this.sheetName=sheetName;this.rowNumber=rowNumber;this.dataJson=dataJson;}
  public Long getId(){return id;} public String getSheetName(){return sheetName;} public Integer getRowNumber(){return rowNumber;} public String getDataJson(){return dataJson;}
}
