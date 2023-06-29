import { Icon, IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import React from 'react'

type ThemeToggleProps = {
}

function ThemeToggle(props: ThemeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      aria-label='Toggle color mode'
      size='xs'
      bg='transparent'
      icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
    />
  )
}

export default ThemeToggle