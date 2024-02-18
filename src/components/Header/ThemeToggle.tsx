import { useMantineColorScheme, Select } from '@mantine/core'

function ThemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()

  return (
    <Select
      className='w-24'
      value={colorScheme}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(value) => setColorScheme(value as any)}
      data={['auto', 'light', 'dark']}
    />
  )
}

export default ThemeToggle