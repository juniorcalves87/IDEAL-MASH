# MFV — Manutenção Field Vision (Java)

Projeto Java 21 + Spring Boot + Maven, separado do frontend original e preparado para compilação externa.

## Objetivo
Construir o sistema de PCM e manutenção industrial usando a base real `data/REFRIGERACAO.xlsx`, preservando as 12 abas: MODELO, DASH, Programação, IP24, IW38, Planos ativos, Tolerância, Turnos, PMOC BASE, Local, EXCLUSÃO e Planilha8.

## Executar
Requisitos: JDK 21+ e Maven 3.9+.

```bash
mvn clean package
java -jar target/mfv-java-1.0.0.jar
```

API: `GET /api/health` e `GET /api/base`.

Importação: `POST /api/base/import` usando multipart `file`.

## Próximas fases
- normalização persistente das 12 abas;
- PCM Engine e regras de periodicidade/tolerância/turnos/exclusões;
- programação diária/semanal/mensal/trimestral/anual;
- SAP IW38 x IP24;
- PMOC x ativos x planos x locais;
- dashboard real;
- QR, campo, offline, relatórios e assinatura;
- MANU IA server-side;
- RBAC e auditoria;
- PostgreSQL e deploy.

Não colocar chaves de IA no código-fonte. Usar variáveis/secrets no servidor.
