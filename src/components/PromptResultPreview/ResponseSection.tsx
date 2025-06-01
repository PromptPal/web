import LakeModal from '@annatarhe/lake-ui/modal'
import { motion } from 'framer-motion'
import { MagnetIcon, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import Button from '../Button/Button'
import ResponseChoiceItem from './ResponseChoiceItem'
import SVGPreview from './SVGPreview'
import { ResponseChoice } from './types'

type ResponseSectionProps = {
  choices: ResponseChoice[]
}

/**
 * Component for displaying response data
 */
function ResponseSection({ choices }: ResponseSectionProps) {
  const isSvg
    = choices.length > 0
      && choices[0].message.content.startsWith('<svg')
      && choices[choices.length - 1].message.content.endsWith('</svg>')

  const [isFullScreen, setIsFullScreen] = useState(false)

  if (choices.length === 0) {
    return (
      <div className='col-span-full flex flex-col items-center justify-center p-12 rounded-xl backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl shadow-gray-700/50'>
        No response
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex-1'
    >
      <div className='p-6 rounded-lg bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl shadow-lg'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <MessageSquare size={20} className='text-blue-400' />
              <h2 className='text-xl font-bold text-gray-200'>Response</h2>
            </div>
            <div>
              <Button
                onClick={() => setIsFullScreen(true)}
                variant='ghost'
                size='sm'
                icon={MagnetIcon}
              >
                Full screen
              </Button>
            </div>
          </div>
          <div className='space-y-4'>
            {isSvg
              ? (
                  <SVGPreview
                    svg={choices.map(c => c.message.content).join('')}
                  />
                )
              : (
                  choices.map((choice, i) => (
                    <ResponseChoiceItem key={i} choice={choice} index={i} />
                  ))
                )}
          </div>
        </div>
      </div>
      <LakeModal
        title='Response'
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      >
        <div className='p-6 rounded-lg bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl shadow-lg'>
          <div className='space-y-4'>
            {isSvg
              ? (
                  <SVGPreview
                    svg={choices.map(c => c.message.content).join('')}
                  />
                )
              : (
                  choices.map((choice, i) => (
                    <ResponseChoiceItem key={i} choice={choice} index={i} />
                  ))
                )}
          </div>
        </div>
      </LakeModal>
    </motion.div>
  )
}

export default ResponseSection
