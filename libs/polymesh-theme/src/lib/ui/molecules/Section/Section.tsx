import { Heading } from '@chakra-ui/react'
import React from 'react'
import { SectionContainer, SectionContainerProps } from '../../atoms'

export type SectionProps = SectionContainerProps & { title?: string | React.ReactNode, center?: boolean }

export const Section: React.FC<SectionProps> = ({ title, children, center, ...rest }) => {
  return (
    <SectionContainer {...rest}>
        {Boolean(title) && <Heading as="h2" mb="2.5rem !important" size="3xl">{title}</Heading>}
        {children}
    </SectionContainer>
  )
}

export default Section