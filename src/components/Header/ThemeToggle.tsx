import { useMantineColorScheme, Select } from '@mantine/core'
import React from 'react'


function ThemeToggle() {
  const { setColorScheme, colorScheme, clearColorScheme } = useMantineColorScheme()

  console.warn('TODO')

  return (
    <Select value={colorScheme}
      onChange={(value) => setColorScheme(value as any)}
      data={['auto', 'light', 'dark']}
    />
  )



  // return (
  //   <IconButton
  //     aria-label='Toggle color mode'
  //     size='xs'
  //     bg='transparent'
  //     icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
  //     onClick={toggleColorMode}
  //   />
  // )
}

export default ThemeToggle