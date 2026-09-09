# Entrega Fase 2

Núcleo persistente + reconciliação + testes + empacotamento externo.

Status do código: implementado na branch `mfv-java`.

Validação automatizada: configurada em `.github/workflows/mfv-java-build.yml` para Java 21 e `mvn -B clean verify`.

Limitação desta sessão: não há runner Maven/JDK com acesso ao Maven Central no ambiente local, então não foi possível declarar um build executado aqui como aprovado. O CI/runner externo deve fornecer a confirmação objetiva.
