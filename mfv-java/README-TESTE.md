# Teste externo rápido

```bash
git clone --branch mfv-java --depth 1 https://github.com/juniorcalves87/IDEAL-MASH.git
cd IDEAL-MASH/mfv-java
mvn -B clean verify
mvn spring-boot:run
```

Em outro terminal:
```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/base
curl http://localhost:8080/api/pcm/mapa-52-semanas?year=2026
curl http://localhost:8080/api/sap/reconciliacao
```
