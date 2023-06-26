import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage<string | null>(() => localStorage)

export const tokenAtom = atomWithStorage<string | null>('pp:token', null, storage)
