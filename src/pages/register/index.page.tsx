import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

import { api } from '@/lib/axios'

import { Container, Form, FormError, Header } from './style'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'User must be minimum 3 letters')
    .regex(/^([a-z\\-]+)$/i, {
      message: 'User must be only letter and hyphen',
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, 'Name must be minimum 3 letters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue, // ? serve para setar um valor de forma manual ou programática
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      // ? estou verificando se dentro do error possui uma msg conforme definido no index.api.ts, para gerar um alerta da msg
      if (error instanceof AxiosError && error?.response?.data.message) {
        alert(error.response.data.message)
        return
      }
      console.log(error) // ? para qualquer outro erro apenas mostro no console
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Welcome to Ignite Call!</Heading>
        <Text>
          We need some info to create your profile! You can update it later 😉
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Username</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="your-user"
            {...register('username')}
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">Full name</Text>
          <TextInput placeholder="your name" {...register('name')} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
