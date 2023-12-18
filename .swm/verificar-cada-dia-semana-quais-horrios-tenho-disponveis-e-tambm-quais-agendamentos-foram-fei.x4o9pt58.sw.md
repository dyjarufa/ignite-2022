---
id: x4o9pt58
title: '   Verificar cada dia semana, quais horários tenho disponíveis e também
  quais agendamentos foram fei'
file_version: 1.1.3
app_version: 1.18.42
---

$queryRaw: Realizar query complexo no Prisma

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/api/users/[username]/blocked-dates.api.ts

```typescript
46       const blockedDateRaw: Array<{ date: number }> = await prisma.$queryRaw`
47         SELECT
48           EXTRACT(DAY FROM S.date) AS date,
49           COUNT(S.date) AS amount,
50           ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60 ) AS size
51
52         FROM schedulings S
53
54         LEFT JOIN user_time_intervals UTI
55           ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
56
57         WHERE S.user_Id = ${user.id}
58           AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
59
60         GROUP BY EXTRACT(DAY from S.date),
61           ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60 )
62
63         HAVING amount >= size
64       `
65
66       const blockedDates = blockedDateRaw.map((item) => item.date)
67
68       console.log(blockedDateRaw)
69
70       return res.json({ blockedWeekDays, blockedDates })
```

<br/>

Essa query SQL é utilizada para consultar uma base de dados e retornar informações específicas sobre agendamentos (`schedulings`) feitos por um usuário específico. Vamos decompô-la para entender melhor o que cada parte faz:

1.  `EXTRACT(DAY FROM S.date) AS date`:

    - Esta parte da query extrai o dia do campo `date` na tabela `schedulings` (identificado como `S.date`). O `EXTRACT` é uma função SQL que permite selecionar uma parte específica de um campo de data/hora, como o dia, mês ou ano. Neste caso, ela está extraindo o dia.

    - O `AS date` renomeia a coluna resultante para `date`.

2.  `COUNT(S.date) AS amount`:

    - Esta parte conta o número de registros para cada dia. `COUNT` é uma função de agregação que conta o número de linhas que correspondem a um critério específico.

    - `AS amount` renomeia a coluna resultante para `amount`.

3.  `FROM schedulings S`:

    - Especifica a tabela de onde os dados devem ser extraídos, que é `schedulings`. O `S` é um alias para a tabela, usado para referência nas outras partes da query.

4.  `WHERE S.user_Id = ${user.id}` **e** `AND DATE_FORMAT(S.date, "%Y-%m") = ${`**${year}-${month}**`}`:

    - Esta é a condição de filtragem. Seleciona registros da tabela onde o `user_Id` é igual ao `id` do usuário especificado e onde o mês e o ano da data do agendamento (`S.date`) correspondem ao mês e ano especificados.

5.  `GROUP BY EXTRACT(DAY from S.date)`:

    - Esta parte da query agrupa os resultados pelo dia do agendamento. Isso significa que a contagem (`COUNT`) será feita separadamente para cada dia.

6.  `console.log(blockedDateRaw)`:

    - Isso imprime o resultado da query no console para fins de depuração.

7.  `return res.json({ blockedWeekDays })`:

    - Retorna os dados no formato JSON, embora pareça haver um erro aqui, pois a variável `blockedWeekDays` não parece relacionada com o resultado da query `blockedDateRaw`. Você deve querer retornar `blockedDateRaw` ao invés de `blockedWeekDays`.

Resumindo, essa query está contando quantos agendamentos foram feitos por um usuário específico para cada dia de um mês específico

Na expressão `EXTRACT(DAY FROM S.date)`, a palavra `DAY` é um parâmetro da função `EXTRACT` que especifica a parte da data que você deseja extrair. No caso, `DAY` indica que você quer extrair o componente "dia" da data.

Vamos detalhar:

- `EXTRACT`: É uma função em SQL que é usada para obter um componente específico de uma data (como dia, mês, ano, hora, etc.).

- `(DAY FROM S.date)`: Esta é a parte específica da função `EXTRACT` onde você define o que quer extrair e de onde.

  - `DAY` é o componente que está sendo extraído. Isso significa que, de uma data completa (normalmente no formato AAAA-MM-DD), você está interessado apenas no dia (um número entre 1 e 31, dependendo do mês e do ano).

  - `FROM S.date` especifica a coluna de onde a data está sendo extraída. Neste caso, é a coluna `date` da tabela `schedulings` (que foi abreviada para `S`).

Então, se `S.date` tivesse um valor como "2023-12-11", `EXTRACT(DAY FROM S.date)` resultaria em "11", pois é o componente "dia" da data.

Esta função é especialmente útil em consultas onde você precisa agrupar ou comparar dados baseados em um componente específico de datas, como agrupar por dia, mês ou ano.

A sua query SQL está usando `LEFT JOIN` e `HAVING` em conjunto. Vamos entender como cada parte funciona no contexto da sua consulta:

### **Left Join**

O `LEFT JOIN` é usado para combinar linhas de duas tabelas com base em uma condição de correspondência. Nesta query, você está juntando a tabela `schedulings` (S) com `user_time_intervals` (UTI) com base em uma condição específica:

```
sqlCopy code
```

`LEFT JOIN user_time_intervals UTI ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))`

- Isso significa que, para cada agendamento (`scheduling`) que você seleciona, o SQL vai tentar encontrar um registro correspondente na tabela `user_time_intervals` onde o `week_day` na tabela UTI corresponde ao dia da semana do agendamento (considerando um acréscimo de um dia, possivelmente para ajustar diferenças de início da semana).

- Se não houver uma correspondência na tabela UTI, os campos da UTI ainda serão retornados, mas como `NULL`. Esse é o aspecto fundamental do `LEFT JOIN` - ele inclui todos os registros da tabela à esquerda (neste caso, `schedulings`), independentemente de haver uma correspondência na tabela à direita (`user_time_intervals`).

### **Having**

O `HAVING` é usado para filtrar os dados agrupados por uma condição. Diferente do `WHERE`, que filtra antes dos dados serem agrupados, o `HAVING` filtra depois do agrupamento.

Na sua query, `HAVING` é usado assim:

```
sqlCopy code
```

`HAVING amount >= size`

- Após agrupar os dados (usando `GROUP BY`), esse comando filtra para manter apenas os grupos onde o número de agendamentos (`amount`, obtido pela contagem dos agendamentos por dia) é maior ou igual ao `size`. O `size` é calculado como a diferença entre `time_end_in_minutes` e `time_start_in_minutes` na tabela UTI, dividido por 60 (presumivelmente convertendo minutos em horas).

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBaWduaXRlLTIwMjIlM0ElM0FkeWphcnVmYQ==/docs/x4o9pt58).
