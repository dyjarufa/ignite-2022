import { Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../style'
import { FormAnnotation, ProfileBox } from './styles'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()

  console.log(session)

  async function handleUpdateProfile(data: UpdateProfileData) {}

  return (
    <Container>
      <Header>
        <Heading as="strong">Well come to Ignite Call!</Heading>
        <Text>
          We need some info to create your profile! You can update it later 😉
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>
      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Profile Photo</Text>
        </label>

        <label>
          <Text size="sm">About you</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation>
            Share a bit about yourself. It will be featured on your personal
            page
          </FormAnnotation>
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Finish
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res) //* passa o req e res para que ele consiga obter informações da sessão
  )

  return {
    props: {
      session
    },
  }
}
