# Fase 2 — Persistência e Reconciliação

Implementado nesta fase:
- Persistência das linhas das 12 abas em H2/JPA.
- Versionamento das importações.
- Importação transacional da planilha XLSX.
- Resumo persistente da base.
- Reconciliação flexível IW38 x IP24 por chave comum priorizada.
- APIs REST de base e reconciliação.
- Testes das regras de programação.
- Pipeline Maven/Java 21 e pacote JAR como artefato.
- Dockerfile e docker-compose para teste externo.

A planilha real permanece como fonte operacional e pode ser importada pelo endpoint, evitando hardcode de indicadores.
