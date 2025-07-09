import React from 'react'

import { AnimationExamples } from '@/components/Animations'
import { useTitle } from '@/hooks/useTitle'

interface Props {
  title?: string
}
const AnimationsPage: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  return (
    <div className="animations-page h-screen overflow-y-auto overflow-x-hidden">
      <div className="min-h-full pb-4 sm:pb-6 md:pb-8 px-2 sm:px-4 md:px-6">
        <AnimationExamples />
      </div>
    </div>
  )
}

export default AnimationsPage
