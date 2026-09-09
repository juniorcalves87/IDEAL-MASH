# Final test

Execute from `mfv-java`:

```bash
mvn -B clean verify
```

Expected: Maven compilation succeeds and all JUnit tests pass.

This environment cannot execute Maven with network dependencies, so CI/external runner is the authoritative build result.
