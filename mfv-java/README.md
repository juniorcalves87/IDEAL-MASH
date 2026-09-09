# MFV — Manutenção Field Vision (Java)

Projeto Java 21 + Spring Boot + Maven, separado do frontend original e preparado para compilação externa.

## Objetivo
Construir o sistema de PCM e manutenção industrial usando a base real `data/REFRIGERACAO.xlsx`, preservando as 12 abas: MODELO, DASH, Programação, IP24, IW38, Planos ativos, Tolerância, Turnos, PMOC BASE, Local, EXCLUSÃO e Planilha8.

## Mapa de 52 semanas
O módulo **Mapa Anual de 52 Semanas** representa o Master Plan do PCM por S01–S52 e organiza PM, PdM, inspeções, corretivas planejadas, shutdown, projetos/CAPEX, terceiros, materiais, HH, treinamentos e compliance. A visão deve ser alimentada pelos dados reais e pelo PCM Engine, sem KPIs hardcoded.

Endpoint atual:
`GET /api/pcm/mapa-52-semanas?year=2026`

Regras incorporadas ao domínio:
- AMV 01–04 → segunda-feira;
- AMV 05–08 → terça-feira;
- AMV 09/10/11/13 → quarta-feira;
- Trechos/Lastros/IC → quinta/sexta;
- capacidade normal de 4 ordens/dia;
- exceção até 6 para 2S/5S quando a regra operacional permitir;
- periodicidades previstas: 1S, 2S, 5S, 13S, 26S e 1A.

## Executar
Requisitos: JDK 21+ e Maven 3.9+.

```bash
mvn clean package
java -jar target/mfv-java-1.0.0.jar
```

API: `GET /api/health`, `GET /api/base` e `GET /api/pcm/mapa-52-semanas?year=2026`.

Importação: `POST /api/base/import` usando multipart `file`.

## Próximas fases
- normalização persistente das 12 abas;
- PCM Engine e regras de periodicidade/tolerância/turnos/exclusões;
- programação diária/semanal/mensal/trimestral/anual;
- Mapa de 52 semanas alimentado por ordens e HH reais;
- SAP IW38 x IP24;
- PMOC x ativos x planos x locais;
- dashboard real;
- QR, campo, offline, relatórios e assinatura;
- MANU IA server-side;
- RBAC e auditoria;
- PostgreSQL e deploy.

Não colocar chaves de IA no código-fonte. Usar variáveis/secrets no servidor.
