import { Select, useMantineColorScheme } from '@mantine/core'

function ThemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()

  return (
    <Select
      className="w-24"
      value={colorScheme}
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      onChange={(value) => setColorScheme(value as any)}
      data={['auto', 'light', 'dark']}
    />
  )
}

export default ThemeToggle
