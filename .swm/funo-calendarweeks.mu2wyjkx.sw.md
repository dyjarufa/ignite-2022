---
id: mu2wyjkx
title: Função calendarWeeks
file_version: 1.1.3
app_version: 1.18.21
---

useMemo aqui é usado por se tratar se uma função com calculo custoso. todo vez que o componente for renderizado, ela só será executada quando necessária.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/components/Calendar/index.tsx

```tsx
48       const calendarWeeks = useMemo(() => {
49         const daysInMonthArray = Array.from({
50           length: currentDate.daysInMonth(),
51         }).map((_, i) => {
52           return currentDate.date(i + 1)
53         })
54
55         const firstWeekDays = currentDate.get('day') // ira pegar o número do dia e não o dio da semana
56
57         const previousMonthFillArray = Array.from({
58           length: firstWeekDays,
59         })
60           .map((_, i) => {
61             return currentDate.subtract(i + 1, 'day')
62           })
63           .reverse()
64
65         const lastDayInCurrentMonth = currentDate.set(
66           'date',
67           currentDate.daysInMonth() // pego o último dia do mês
68         )
69
70         const lastWeekDay = lastDayInCurrentMonth.get('day')
71
72         const nextMonthFillArray = Array.from({
73           length: 7 - (lastWeekDay + 1),
74         }).map((_, i) => {
75           return lastDayInCurrentMonth.add(i + 1, 'day')
76         })
77
78         // return nextMonthFillArray
```

<br/>

O hook `useMemo` é utilizado para memorizar o valor calculado de uma função, de forma que essa função só será reexecutada quando uma das suas dependências mudar. Isso é útil para otimizar o desempenho, evitando cálculos desnecessários em cada renderização do componente.

No seu caso, a função `useMemo` está sendo usada para calcular as semanas do calendário com base na data atual (`currentDate`). Aqui está o que cada parte do código faz:

- `const calendarWeeks = useMemo(...)`: Declaração de uma constante chamada `calendarWeeks` que irá armazenar o valor retornado pelo `useMemo`.

- `Array.from({ length: currentDate.daysInMonth() })`: Cria um array com um tamanho igual ao número de dias do mês atual. Por exemplo, se `currentDate.daysInMonth()` retorna `30`, será criado um array de `30` elementos.

- `.map((_, i) => { return currentDate.date(i + 1) })`: Transforma esse array em um array de datas do mês atual. O método `map` é usado para iterar sobre cada elemento do array (que inicialmente não contém valores úteis, apenas "slots" vazios). O parâmetro `_` é ignorado (é uma convenção para indicar que o parâmetro não será usado), e o `i` é o índice do elemento atual no array. Para cada elemento, é retornada uma nova data (`currentDate.date(i + 1)`) que representa cada dia do mês.

- O segundo argumento do `useMemo`, `[currentDate]`, é um array de dependências. Isso significa que o cálculo das semanas do calendário só será refeito quando o valor de `currentDate` mudar. Se `currentDate` permanecer o mesmo, o `useMemo` irá retornar o valor memorizado, sem necessidade de recalcular as datas.

Resumindo, o `useMemo` nesse exemplo é utilizado para calcular as datas de cada dia do mês atual e garantir que esse cálculo só seja feito quando a data atual (`currentDate`) mudar, o que pode melhorar o desempenho se o cálculo for pesado ou se for utilizado em um componente que renderiza frequentemente.<br/>

<br/>

Preencher com os dias do mês anterior até completar a semana.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/components/Calendar/index.tsx

```tsx
55         const firstWeekDays = currentDate.get('day') // ira pegar o número do dia e não o dio da semana
56
57         const previousMonthFillArray = Array.from({
58           length: firstWeekDays,
59         })
60           .map((_, i) => {
61             return currentDate.subtract(i + 1, 'day')
62           })
63           .reverse()
64
65         const lastDayInCurrentMonth = currentDate.set(
66           'date',
67           currentDate.daysInMonth() // pego o último dia do mês
68         )
69
70         const lastWeekDay = lastDayInCurrentMonth.get('day')
71
72         const nextMonthFillArray = Array.from({
73           length: 7 - (lastWeekDay + 1),
74         }).map((_, i) => {
75           return lastDayInCurrentMonth.add(i + 1, 'day')
76         })
77
78         // return nextMonthFillArray
```

<br/>

<br/>

1.  `firstDayOfMonthWeekday` pega o dia da semana do primeiro dia do mês (0 para domingo, 1 para segunda-feira, etc.).

2.  `const previousMonthFillArray`: Este array é criado para conter os dias do mês anterior que preenchem a primeira semana do mês atual. Por exemplo, se o mês atual começa numa quarta-feira, `firstWeekDays` seria 3 (considerando que domingo é o dia 0), e você quer os últimos dois dias do mês anterior para preencher domingo e segunda.

3.  `.map((_, i) => { return currentDate.subtract(i + 1, 'day') })`: Para cada elemento do array `previousMonthFillArray`, você está subtraindo dias da `currentDate` para obter os dias do mês anterior. Então, se hoje é 1 de abril e uma quarta-feira, você irá subtrair 1 dia para terça-feira, 31 de março, e assim por diante.

4.  `return { ...previousMonthFillArray, ...daysInMonthArray }`: Esta linha está tentando espalhar (usando o spread operator `...`) os elementos dos dois arrays em um objeto, o que não é correto se você deseja um array único. Para concatenar dois arrays, você deveria usar `[...previousMonthFillArray, ...daysInMonthArray]`<br/>

    ```
    <br/>
    ```

    <br/>

<br/>

Quantos dias vou precisar do próximo mês

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/components/Calendar/index.tsx

```tsx
70         const lastDayInCurrentMonth = currentDate.set(
71           'date',
72           currentDate.daysInMonth() // pego o último dia do mês
73         )
74
75         const lastWeekDay = lastDayInCurrentMonth.get('day')
76
77         const nextMonthFillArray = Array.from({
78           length: 7 - (lastWeekDay + 1),
79         }).map((_, i) => {
80           return lastDayInCurrentMonth.add(i + 1, 'day')
81         })
82
83         // return nextMonthFillArray
84         const calendarDays = [
85           ...previousMonthFillArray.map((date) => {
86             return { date, disabled: true }
87           }),
88           ...daysInMonthArray.map((date) => {
89             return { date, disabled: date.endOf('day').isBefore(new Date()) }
90           }),
91           ...nextMonthFillArray.map((date) => {
92             return { date, disabled: true }
93           }),
94         ]
```

<br/>

<br/>

1.  **Definindo o último dia do mês corrente:**

    ```
    javascriptCopy code
    ```

    `const lastDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth())`

    Aqui, estamos usando a biblioteca `dayjs` para definir uma nova data (`lastDayInCurrentMonth`) que representa o último dia do mês atual. O método `daysInMonth()` retorna o número total de dias no mês corrente, e o método `set('date', value)` está sendo utilizado para definir o dia do objeto `currentDate` para esse valor. Em outras palavras, estamos criando uma nova data que é o último dia do mês corrente.

2.  **Obtendo o dia da semana do último dia do mês:**

    ```
    javascriptCopy code
    ```

    `const lastWeekDay = lastDayInCurrentMonth.get('day')`

    Depois de ter a data do último dia do mês, utilizamos o método `get('day')` para descobrir o dia da semana desse último dia. Em `dayjs`, `get('day')` retorna um número de 0 (domingo) a 6 (sábado), indicando o dia da semana.

3.  **Calculando quantos dias precisamos adicionar para preencher a última semana:**

    ```
    javascriptCopy code
    ```

    `const nextMonthFillArray = Array.from({ length: 7 - (lastWeekDay + 1), }).map((_, i) => { return lastDayInCurrentMonth.add(i + 1, 'day') })`

    Aqui, o objetivo é descobrir quantos dias do próximo mês precisamos adicionar para completar a semana no calendário. Se o último dia do mês é uma quarta-feira (representado pelo número 3), então precisamos adicionar mais 3 dias (quinta-feira, sexta-feira e sábado) para completar a semana, que tem 7 dias. A expressão `7 - (lastWeekDay + 1)` faz exatamente esse cálculo.

    - Usamos `lastWeekDay + 1` porque, se o `lastWeekDay` é 3 (quarta-feira), precisamos começar a contar a partir de quinta-feira, que seria o dia 4 da semana.

    - Subtraímos esse valor de 7 (número total de dias em uma semana) para encontrar quantos dias faltam.

    - Criamos um array com esse comprimento e usamos `map` para criar uma nova data para cada um desses dias, começando do dia seguinte ao último dia do mês (`lastDayInCurrentMonth.add(i + 1, 'day')`).

4.  **Construindo o array final para o calendário:**

    ```javascript
    javascriptCopy code
    ```

    `return [ ...previousMonthFillArray, ...daysInMonthArray, ...nextMonthFillArray, ]`

    O array final que estamos retornando é uma combinação de três arrays:

    - `previousMonthFillArray`: Dias do mês anterior para preencher a primeira semana do calendário.

    - `daysInMonthArray`: Todos os dias do mês corrente.

    - `nextMonthFillArray`: Dias do próximo mês para completar a última semana do calendário.

<br/>

transformar um array de dias (`calendarDays`) em um array de semanas (`calendarWeeks`). Cada semana é um objeto que contém o número da semana (`week`) e os dias que pertencem a essa semana (`days`).

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/components/Calendar/index.tsx

```tsx
91         const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
92           (weeks, _, i, original) => {
93             const isNewWeek = i % 7 === 0
94
95             if (isNewWeek) {
96               weeks.push({
97                 week: i / 7 + 1,
98                 days: original.slice(i, i + 7),
99               })
100            }
101
102            return weeks
103          },
104          []
105        )
106
107        return calendarWeeks
```

<br/>

<br/>

1.  **Definição da função** `reduce`**:**

    ```
    javascriptCopy code
    ```

    `const calendarWeeks = calendarDays.reduce<CalendarWeeks>( (weeks, _, i, original) => { // ... }, [] )`

    - `calendarDays`: é o array original que contém todos os dias que queremos agrupar em semanas.

    - `reduce<CalendarWeeks>`: está definindo o tipo de dado que a função `reduce` irá acumular e retornar, neste caso, um array de objetos onde cada objeto representa uma semana.

    - A função `reduce` recebe dois parâmetros: um callback e um valor inicial para o acumulador (`[]` neste caso).

2.  **Callback da função** `reduce`**:**

    ```
    javascriptCopy code
    ```

    `(weeks, _, i, original) => { // ... }`

    - O callback do `reduce` é chamado para cada item do array `calendarDays`.

    - `weeks` é o acumulador, que começa como um array vazio `[]` e gradualmente é preenchido com os objetos semana.

    - `_` é o elemento atual do array que está sendo processado. Como ele não é usado no corpo da função, foi substituído por um underscore para indicar que é um parâmetro não utilizado.

    - `i` é o índice do elemento atual do array.

    - `original` é o array original `calendarDays` que está sendo reduzido.

3.  **Verificação se um novo objeto semana deve ser criado:**

    ```
    javascriptCopy code
    ```

    `const isNewWeek = i % 7 === 0`

    - `isNewWeek` é uma constante booleana que verifica se o índice atual é múltiplo de 7, indicando o início de uma nova semana no calendário.

4.  **Criação do objeto semana:**

    ```
    javascriptCopy code
    ```

    `if (isNewWeek) { weeks.push({ week: i / 7 + 1, days: original.slice(i, i + 7), }) }`

    - Se `isNewWeek` for `true`, um novo objeto é criado e adicionado ao array `weeks`.

    - `week: i / 7 + 1` calcula o número da semana atual baseando-se no índice do dia no array original. Como o índice começa em 0, `i / 7` retorna um número a menos do que o número real da semana, então adicionamos 1 para corrigir isso.

    - `days: original.slice(i, i + 7)` cria um subarray de `original` contendo os 7 dias da semana atual.

5.  **Retorno do acumulador:**

    ```
    javascriptCopy code
    ```

    `return weeks`

    - Após cada iteração, o acumulador `weeks` é retornado e passado para a próxima iteração do `reduce`.

Ao final do processo, `calendarWeeks` será um array onde cada item é um objeto representando uma semana do calendário, contendo o número da semana e os dias pertencentes a essa semana.

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBaWduaXRlLTIwMjIlM0ElM0FkeWphcnVmYQ==/docs/mu2wyjkx).
