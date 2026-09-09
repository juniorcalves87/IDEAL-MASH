# Roteiro de teste da Fase 2

## Teste unitário + pacote
`mvn -B clean verify`

## Smoke test
`mvn spring-boot:run`

Depois consultar `/api/health`, `/api/base`, `/api/pcm/mapa-52-semanas?year=2026` e `/api/sap/reconciliacao`.

## Importação
Enviar `REFRIGERACAO.xlsx` para `POST /api/base/import` usando campo multipart `file`.

## Aceite
- HTTP 200 em health.
- Base retorna versão e contagens persistidas.
- Mapa retorna exatamente 52 semanas.
- Regras de planejamento permanecem cobertas pelos testes.
- Reconciliação informa chave e cobertura quando IW38/IP24 possuem chave comum.
