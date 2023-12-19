```ts
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod' //* zod adotado para usar o mínimo de parse para as informações vindas do "request"
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POSt') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not exist.' })
  }

  // Aqui não será feita uma validação pois ela ja foi feita no front-end, aqui será realizada uma dupla verificação e um parse nos dados

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string(),
    observations: z.string(),
    date: z.string().datetime(), // datetime => converte o farmato de string em um objeto Date do javascript
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body
  )

  // não vou depender que o front-end me envie, então eu forço que toda hora não  esteja quebrada mas esteja no início da hora
  // É mais fácil eu validar que no BD exista uma hora agendada naquele horário
  const schedulingDate = dayjs(date).startOf('hour')

  // Refazer novamente a validação de agendamentos

  /* verificar se a data já passou */
  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({ message: 'Date is in the past' })
  }

  /* verificar se nao existe um scheduling no mesmo horário */
  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_Id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res
      .status(400)
      .json({ message: 'There is another scheduling at the same time' })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_Id: user.id,
    },
  })

  return res.status(201).end()
}
```

## Correção ao esquecer do uso da palavra "default" ao exportar a função:

```js
  error - Error [TypeError]: resolver is not a function
    at /home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/api-utils/node.js:440:16
    at /home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/lib/trace/tracer.js:113:36
    at NoopContextManager.with (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7057)
    at ContextAPI.with (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:516)
    at NoopTracer.startActiveSpan (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18086)
    at ProxyTracer.startActiveSpan (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18847)
    at /home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/lib/trace/tracer.js:102:107
    at NoopContextManager.with (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7057)
    at ContextAPI.with (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:516)
    at NextTracerImpl.trace (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/lib/trace/tracer.js:102:32)
    at apiResolver (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/api-utils/node.js:438:63)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async DevServer.runApi (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/next-server.js:668:9)
    at async Object.fn (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/next-server.js:1132:35)
    at async Router.execute (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/router.js:315:32)
    at async DevServer.runImpl (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/base-server.js:604:29)
    at async DevServer.run (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/dev/next-dev-server.js:922:20)
    at async DevServer.handleRequestImpl (/home/jady/www/developer/ROCKETSEAT/Ignite-reactjs-2022/project-06-fullstack/ignite-call/node_modules/next/dist/server/base-server.js:533:20) {
  digest: undefined
}
```

A razão pela qual o uso de export default é crucial no contexto das rotas da API Next.js está ligado ao modo como o Next.js identifica e lida com essas funções.

No Next.js, cada arquivo dentro da pasta pages/api é tratado como um endpoint de API separado. A forma como o Next.js estabelece a relação entre o arquivo e o endpoint da API é por meio da função exportada por padrão (default) desse arquivo. Aqui estão os detalhes:

Identificação Automática de Handlers de API: O Next.js automaticamente mapeia arquivos no diretório pages/api para rotas da API. Cada arquivo representa um endpoint, e a função exportada por padrão desse arquivo é usada como o handler para solicitações HTTP para aquele endpoint específico.

Exportação Padrão (Default): Quando você usa export default, está indicando ao Next.js que esta é a função principal (ou única) que deve ser exportada desse arquivo. O Next.js espera que essa função seja o handler da API, que será chamada quando uma solicitação HTTP é feita para a rota correspondente.

Compatibilidade com a Convenção do Next.js: O Next.js foi projetado para trabalhar com essa estrutura específica. Ele procura por uma exportação padrão em cada arquivo de API para saber qual função deve invocar ao receber uma solicitação HTTP. Se não encontrar uma exportação padrão, o Next.js não consegue associar a solicitação HTTP a um handler válido, resultando no erro que você observou.

Flexibilidade no Design: Essa abordagem também permite que você tenha várias funções ou lógica adicional dentro do mesmo arquivo, mas apenas a função que você quer que lide com as solicitações da API deve ser exportada como padrão.

Clareza e Manutenção: Ao usar export default para exportar o handler da API, você torna claro para outros desenvolvedores (ou para você mesmo no futuro) qual função é responsável pelo tratamento das solicitações da API neste arquivo específico.

Portanto, ao corrigir seu código para usar export default, você alinhou sua implementação com as expectativas e o funcionamento interno do Next.js, permitindo que o framework identifique e utilize corretamente sua função de handler de API.
