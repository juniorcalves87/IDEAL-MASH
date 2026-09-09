# MFV Java — Pacote de Teste Externo

## Requisitos
- JDK 21+
- Maven 3.9+

## Compilar e testar
```bash
cd mfv-java
mvn clean verify
```

## Executar
```bash
mvn spring-boot:run
```

## Endpoints
- `GET /api/health`
- `GET /api/base`
- `GET /api/pcm/mapa-52-semanas?year=2026`
- `GET /api/sap/reconciliacao`
- `POST /api/base/import` com multipart `file`

## Observação
A planilha operacional real não deve ser substituída por dados fictícios. Para teste completo, copie `REFRIGERACAO.xlsx` para `mfv-java/data/` ou use o endpoint de importação.

## Critérios mínimos
1. Aplicação inicia sem erro.
2. Testes JUnit passam.
3. Importação registra versão e linhas das abas.
4. Reconciliação IW38 x IP24 identifica uma chave comum quando disponível.
5. Nenhuma chave de IA fica no código-fonte.
