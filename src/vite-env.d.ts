/// <reference types="vite/client" />

declare module '~build/info' {
  export const lastTag: string
}
declare module '~build/time' {
  const buildTime: Date
  export default buildTime
}