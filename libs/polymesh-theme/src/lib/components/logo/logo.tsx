import React from 'react';
import { IconProps, useColorMode } from '@chakra-ui/react';

import Light from './light';
import Dark from './dark';

export type LogoProps = {
  variant?: 'light' | 'dark' | 'grey';
};

function roundToTwo(num: number) {
  return Math.round(num * 100 + Number.EPSILON) / 100;
}

const calculateWidth = (height: number): number => {
  return roundToTwo(height * 0.123);
};

const calculateHeight = (width: number): number => {
  return roundToTwo(width * 8.125);
};

const extractUnits = (property: string): { value: number; unit: string } => {
  const value = Number(property.replace(/[^0-9.-]+/g, ''));
  const unit = property.replace(/[^a-z]+/g, '');

  return { value, unit };
};

const getHeight = (width: IconProps['width']): IconProps['height'] => {
  if (typeof width === 'number') {
    return calculateHeight(width);
  }

  if (typeof width === 'string') {
    const { value, unit } = extractUnits(width);
    return calculateHeight(value) + unit;
  }

  if (typeof width === 'object') {
    const computed: any = {};
    Object.keys(width).forEach((key) => {
      const { value, unit } = extractUnits(width[key]);
      computed[key] = calculateHeight(value) + unit;
    });

    return computed;
  }
};

const getWidth = (height: IconProps['height']): IconProps['width'] => {
  if (typeof height === 'number') {
    return calculateHeight(height);
  }

  if (typeof height === 'string') {
    const { value, unit } = extractUnits(height);
    return calculateHeight(value) + unit;
  }

  if (typeof height === 'object') {
    const computed: any = {};
    Object.keys(height).forEach((key) => {
      const { value, unit } = extractUnits(height[key]);
      computed[key] = calculateHeight(value) + unit;
    });

    return computed;
  }
};

const extractResponsiveValues = ({
  h,
  height,
  w,
  width,
}: IconProps): Pick<IconProps, 'height' | 'width'> => {
  if (h || height) {
    return { height: h || height, width: getWidth(h || height) };
  }

  if (w || width) {
    return { height: getWidth(w || width), width: w || width };
  }

  return {};
};

const Logo: React.FC<LogoProps & Omit<IconProps, 'boxSize'>> = ({
  variant,
  viewBox,
  h,
  height,
  w,
  width,
  ...rest
}) => {
  const { height: computedHeight, width: computedWidth } = React.useMemo(
    () => extractResponsiveValues({ h, height, w, width }),
    [h, height, w, width]
  );
  const { colorMode } = useColorMode();

  if (variant === 'grey') {
    return <Dark height={computedHeight} width={computedWidth} color="#565656" {...rest} />;
  }

  if (variant === 'dark' || (colorMode === 'dark' && !variant)) {
    return <Dark height={computedHeight} width={computedWidth} color="white" {...rest} />;
  }
  

  return <Light height={computedHeight} width={computedWidth} {...rest} />;
};

export default Logo;
