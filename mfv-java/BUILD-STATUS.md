# Build Status

O código foi preparado para compilação externa via Maven e CI. A execução efetiva depende do runner externo/GitHub Actions, pois este ambiente de conversa não possui JDK/Maven com acesso de rede ao Maven Central.

Comando oficial:
`mvn -B clean verify`
