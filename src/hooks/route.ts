import { useParams } from 'react-router-dom'

export function useProjectId() {
  const pid = useParams<{ pid: string }>().pid
  if (pid) {
    return ~~pid
  }
  return null
}