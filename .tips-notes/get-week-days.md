Esta função é utilizada para obter os nomes dos dias da semana, com a opção de retornar a versão curta (três primeiros caracteres) ou a versão completa.

1. **Definição da Interface `GetWeekDaysParams`:**

   Primeiro, é definida uma interface chamada `GetWeekDaysParams`. Essa interface tem uma propriedade opcional chamada `short`, que é um booleano (`true` ou `false`). Se `short` for `true`, a função retornará os nomes dos dias da semana em formato curto.

2. **Definição da Função `getWeekdays`:**

   A função `getWeekdays` é declarada com um parâmetro chamado `{ short = false }`. Este parâmetro usa a desestruturação para acessar diretamente a propriedade `short` dentro do objeto passado. Se nenhum objeto for passado, `{ short = false }` será o valor padrão, significando que a versão completa dos nomes dos dias da semana será retornada por padrão.

3. **Criação de um `Intl.DateTimeFormat`:**

   Dentro da função, um objeto `Intl.DateTimeFormat` é criado. Este objeto é usado para formatar datas de acordo com o idioma e as opções fornecidas. Aqui, está configurado para o idioma 'en-US' (inglês dos Estados Unidos) e a opção `{ weekday: 'long' }` indica que queremos o nome completo do dia da semana.

4. **Geração dos Nomes dos Dias da Semana:**

   - `Array.from(Array(7).keys())`: Esta linha cria um array de 7 elementos (0 a 6), representando cada dia da semana.
   - `.map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))`: Cada número de 0 a 6 é mapeado para uma data correspondente em junho de 2021 (o mês é zero-indexado, então 5 representa junho). O `formatter` formata essas datas para obter os nomes completos dos dias da semana em Português.
   - `.map((weekDay) => {...})`: Cada nome de dia da semana é então mapeado novamente. Se `short` for `true`, a função retorna os três primeiros caracteres do nome do dia da semana em maiúsculas. Se `short` for `false`, a função retorna o nome completo do dia da semana, com a primeira letra em maiúscula.

Por exemplo, se `short` for `false`, a função retornará `["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]`. Se `short` for `true`, a função retornará `["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]`.

```ts
interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekdays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
```
