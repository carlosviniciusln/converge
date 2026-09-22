# Banco do motor de faturamento

As migrations em `migrations/` são forward-only e destinadas ao SQL Server 2019 ou superior.

## Aplicação

Execute os arquivos em ordem lexicográfica com uma identidade que possa criar schema, tabelas, índices e triggers:

```powershell
sqlcmd -S "$env:DB_SERVER" -d "$env:DB_NAME" -G -b -i "database/migrations/V001__create_billing_motor.sql"
```

O parâmetro `-b` encerra com erro quando a migration falha. Cada migration registra sua versão em `billing.schema_migration` e pode ser reaplicada sem recriar objetos.

## Convenções

- Valores monetários usam `bigint` em centavos.
- Datas de negócio usam `date`; instantes de auditoria usam UTC em `datetime2(3)`.
- Tabelas mutáveis expõem `rowversion` para concorrência otimista.
- Resultados, memórias e auditoria são append-only e protegidos por triggers.
- Toda nova mudança de schema deve ser um novo arquivo `V###__descricao.sql`; migrations aplicadas não devem ser alteradas.