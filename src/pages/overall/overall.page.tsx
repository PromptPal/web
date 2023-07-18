import { useAtomValue } from 'jotai'
import React from 'react'
import { projectAtom } from '../../stats/project'
import { Box, Text, Button, Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProjectTopPromptsChart from '../../components/Project/TopPromptsChart'
import { getProjectDetail } from '../../service/project'

function OverallPage(props: OverallPageProps) {
  const p = useAtomValue(projectAtom)

  const { data: pj } = useQuery({
    queryKey: ['projects', p],
    enabled: !!p,
    queryFn: ({ signal }) => getProjectDetail(p, signal)
  })

  if (!p) {
    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        mt={4}
      >
        <Heading>😔</Heading>
        <Heading>No existing project found</Heading>
        <Button
          as={Link}
          to='/projects/new'
          colorScheme='teal'
          mt={4}
        >
          Create new project
        </Button>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader display='flex' flexDirection='row' alignItems='flex-end'>
        <Heading size='lg'>
          {pj?.name}
        </Heading>
        <Text ml={2} color={'gray.500'} fontSize={'xs'}>recent 7 days</Text>
      </CardHeader>
      <CardBody>
        <ProjectTopPromptsChart projectId={p} />
      </CardBody>
    </Card>
  )
}

export default OverallPage