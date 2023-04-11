import React from 'react';
import { IconProps, useColorMode } from '@chakra-ui/react';

import Light from './light';
import Dark from './dark';

export type LogoProps = {
  variant?: 'light' | 'dark';
};

function roundToTwo(num: number) {
  return Math.round(num * 100 + Number.EPSILON) / 100;
}

const calculateHeight = (width: number): number => {
  return roundToTwo(width * 8.125);
};

const extractUnits = (property: string): { value: number; unit: string } => {
  const value = Number(property.replace(/[^0-9.-]+/g, ''));
  const unit = property.replace(/[^a-z]+/g, '');

  return { value, unit };
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
      const { value, unit } = extractUnits((height as any)[key]);
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

  if (variant === 'dark' || (colorMode === 'dark' && !variant)) {
    return <Dark height={computedHeight} width={computedWidth} {...rest} />;
  }

  return <Light height={computedHeight} width={computedWidth} {...rest} />;
};

export default Logo;
