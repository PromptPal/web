import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { tokenAtom } from '../../stats/profile'
import { getProjectList } from '../../service/project'
import { Center, Divider, Select, Stack } from '@chakra-ui/react'
import { projectAtom } from '../../stats/project'

type ProjectSelectorProps = {
}

function ProjectSelector(props: ProjectSelectorProps) {
  const logged = !!useAtomValue(tokenAtom)
  const [currentProject, setCurrentProject] = useAtom(projectAtom)

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: ({ signal }) => getProjectList(1 << 30, signal),
    enabled: logged
  })

  useEffect(() => {
    if (!projects?.data || projects.data.length === 0) {
      return
    }
    if (currentProject) {
      return
    }

    setCurrentProject(projects.data[0].id)
  }, [projects?.data, currentProject])

  if (!projects?.data) {
    return null
  }

  return (
    <Stack flexDirection='row' alignItems='center' gap={1}>
      <Center height={'20px'} ml={2} mr={1}>
        <Divider orientation='vertical' />
      </Center>
      <Select
        size='xs'
        value={currentProject}
        onChange={(e) => setCurrentProject(e.target.value!)}
      >
        {projects?.data?.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </Select>
    </Stack>
  )
}

export default ProjectSelector