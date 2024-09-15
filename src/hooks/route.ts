import { useParams } from '@tanstack/react-router'

export function useProjectId() {
  const pid = useParams({ strict: false }).pid
  if (pid) {
    return ~~pid
  }
  // FIXME: use type safe params instead
  return -1
}
