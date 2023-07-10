import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

import { Form, FormAnnotation } from './styles'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'User must be minimum 3 letters ' })
    .regex(/^([a-z\\-]+)$/i, { message: 'User must be only letter and hyphen' })
    .transform((username) => username.toLowerCase()), // ? como o zod nos permite realizar transformação dos dados */
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUserNameForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema), // ? iniciar a validação baseado na regra definida no z.object
  })

  async function handleClaimUsernameForm(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`) // *router.push retorna uma promise, por isso
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsernameForm)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="your-user"
          {...register('username')}
        />
        <Button size="md" type="submit">
          Booking
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text>
          {errors.username ? errors.username?.message : 'Type desired username'}
        </Text>
      </FormAnnotation>
    </>
  )
}
