import React from 'react';
import {  VStack, Box, Flex, HStack, Square, Text, Heading } from '@chakra-ui/react';

import { PolymeshTheme } from '../theme-provider';

import { colors } from './colors';

type ColorRendererProps = {
    group: string;
    shade: string;
    color: string;
  };
  
  const ColorItem: React.FC<ColorRendererProps> = ({
    group,
    shade,
    color,
  }) => {
    return (
      <Flex alignItems="center" justifyItems="center" direction="column">
        <Square bg={color} size="30px" />
        <Text fontSize="xs">
          {group}.{shade}
        </Text>
        <Text fontSize="10px" casing="uppercase">
          {color}
        </Text>
      </Flex>
    );
  };


export const ColorRenderer = () => {    
    return (
      <PolymeshTheme>
        <HStack align="start" justify="center" p="20px" gap="20px">
          {Object.keys(colors).map((group) => 
              <Box>
              <Heading size="md" mb="10px">{group}</Heading>
              <VStack>
                  {/* @ts-expect-error wrong index */}
                  {Object.keys(colors[group]).map((shade) => (
                    <ColorItem
                      key={group + shade}
                      group={group}
                      shade={shade}
                      // @ts-expect-error wrong index
                      color={colors[group][shade]}
                    />
                  ))}
              </VStack>
              </Box>
          )}
        </HStack>
      </PolymeshTheme>
    );
  };

  export default ColorRenderer;