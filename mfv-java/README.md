# MFV — Manutenção Field Vision (Java)

Projeto Java 21 + Spring Boot + Maven, separado do frontend original e preparado para compilação externa.

## Fase 2 entregue
- Persistência JPA/H2 das linhas das 12 abas.
- Versionamento das importações.
- Importação XLSX transacional.
- Resumo persistente da base.
- Reconciliação IW38 x IP24 por chave comum detectada.
- Mapa anual S01–S52 e regras de programação.
- Testes JUnit.
- GitHub Actions para `mvn clean verify`.
- Dockerfile e docker-compose para execução externa.

## Fonte real
`REFRIGERACAO.xlsx` deve ser fornecida em `data/` para execução local ou enviada por `POST /api/base/import` com multipart `file`. Não são usados KPIs fictícios.

## Regras PCM
Periodicidades: `1S`, `2S`, `5S`, `13S`, `26S`, `1A`.
- AMV 01–04 → segunda-feira;
- AMV 05–08 → terça-feira;
- AMV 09/10/11/13 → quarta-feira;
- Trechos/Lastros/IC → quinta/sexta;
- capacidade normal de 4 ordens/dia;
- exceção até 6 para 2S/5S quando permitida;
- planos excluídos não entram no planejamento.

## APIs
- `GET /api/health`
- `GET /api/base`
- `POST /api/base/import`
- `GET /api/pcm/mapa-52-semanas?year=2026`
- `GET /api/sap/reconciliacao`

## Compilar e testar
```bash
cd mfv-java
mvn -B clean verify
```

## Executar
```bash
mvn spring-boot:run
```

## Docker
```bash
mvn clean package
docker build -t mfv-java:1.1.0 .
docker run --rm -p 8080:8080 mfv-java:1.1.0
```

A planilha real atual não fornece duração HH confiável; portanto o sistema não inventa HH nem ocupação. Esses indicadores só devem ser calculados quando houver fonte de duração/capacidade válida.

Nunca armazenar chaves de IA no repositório. Use secrets/variáveis de ambiente no servidor.
