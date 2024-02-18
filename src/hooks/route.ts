import { useSearchParams } from 'react-router-dom'

export function useProjectId() {
  const [sp] = useSearchParams()
  if (sp.has('pjId')) {
    return ~~(sp.get('pjId') ?? '0')
  }
  return null
}