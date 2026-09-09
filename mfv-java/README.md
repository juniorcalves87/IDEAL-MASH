# MFV — Manutenção Field Vision (Java)

Projeto Java 21 + Spring Boot + Maven, separado do frontend original e preparado para compilação externa.

## Fonte de dados
A aplicação usa o arquivo real `data/REFRIGERACAO.xlsx` quando ele estiver disponível no ambiente de execução. O workbook contém as 12 abas: MODELO, DASH, Programação, IP24, IW38, Planos ativos, Tolerância, Turnos, PMOC BASE, Local, EXCLUSÃO e Planilha8.

A API também permite importar/atualizar a base em runtime por `POST /api/base/import` com multipart `file`.

## Mapa de 52 semanas / PCM Engine
O `RealPcmEngineService` lê a programação real do workbook para o ano solicitado, remove planos presentes em `EXCLUSÃO`, classifica as atividades e consolida S01–S52. Se a aba `Programação` não produzir ocorrências para o ano, o motor usa `IP24 + Planos ativos` como fallback para gerar ocorrências pelas periodicidades suportadas.

Periodicidades: `1S`, `2S`, `5S`, `13S`, `26S`, `1A`.

Regras incorporadas ao domínio:
- AMV 01–04 → segunda-feira;
- AMV 05–08 → terça-feira;
- AMV 09/10/11/13 → quarta-feira;
- Trechos/Lastros/IC → quinta/sexta;
- capacidade normal de 4 ordens/dia;
- exceção até 6 para 2S/5S;
- planos excluídos não entram no mapa.

Categorias do Master Plan:
PM, PdM, Inspeção, Corretiva Planejada, Shutdown, Projeto/CAPEX, Terceiros, Materiais, Mão de Obra, Treinamento e Compliance.

### Endpoints
- `GET /api/health`
- `GET /api/base`
- `POST /api/base/import`
- `GET /api/pcm/mapa-52-semanas?year=2026`
- `GET /api/pcm/diagnostico`

O retorno do mapa informa por semana: ordens, categorias, pico diário, capacidade normal/excepcional, conflitos de capacidade e conflitos com as regras de dia.

**HH:** a base real atual possui a coluna `Tempo` em `Planos ativos`, porém seus valores observados são descrições de frequência (por exemplo, SEMANAL/MENSAL/SEMESTRAL), não duração em horas. Por isso o motor não inventa HH; `plannedHH`, `availableHH` e ocupação ficam sem valor até existir uma fonte confiável de duração/capacidade.

## Executar
Requisitos: JDK 21+ e Maven 3.9+.

```bash
cd mfv-java
mvn clean test package
java -jar target/mfv-java-1.0.0.jar
```

A aplicação inicia na porta `8080`.

## Testes
Os testes de domínio validam as regras AMV, Trechos/Lastros/IC, capacidade diária e exceções.

## Próximas fases
- persistência e versionamento das 12 abas;
- entidades JPA e PostgreSQL;
- tolerância calculada por ciclo;
- SAP IW38 x IP24;
- PMOC x ativos x planos x locais;
- dashboard executivo real;
- programação diária/semanal/mensal/trimestral/anual;
- campo, QR, checklist, fotos, assinatura e PDF;
- MANU IA server-side;
- RBAC, auditoria e segurança;
- PWA/offline/sincronização;
- Docker e deploy.

Nunca colocar chaves de IA no código-fonte. Usar variáveis de ambiente/secrets no servidor.
