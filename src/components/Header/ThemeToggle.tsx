import { useMantineColorScheme } from '@mantine/core'
import React from 'react'


function ThemeToggle() {
  const { setColorScheme, clearColorScheme } = useMantineColorScheme()

  console.warn('TODO')

  return (
    <span>TODO, will be a select options</span>
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