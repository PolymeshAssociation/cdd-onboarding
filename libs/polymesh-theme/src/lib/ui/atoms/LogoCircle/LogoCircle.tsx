import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Icon, IconProps, Link, useColorMode } from '@chakra-ui/react';

export type LogoCircleProps = IconProps & {
  variant: 'color' | 'b&w';
  link?: string
};

export const LogoCircle: React.FC<LogoCircleProps> = ({
  variant = 'color',
  link,
  ...rest
}) => {
  const { colorMode } = useColorMode();

  let component: React.ReactNode = null;

  if (variant === 'color') {
    component = (
      <Icon {...rest} viewBox="0 0 40 41">
        <path
          d="M24.7716 19.4618C24.1713 19.9945 23.1939 20.2832 21.792 20.2832H15.5216V29.8374H18.1436V22.7682H22.1208C23.3702 22.7682 24.4634 22.5444 25.3938 22.0887L25.3954 22.0879C26.3422 21.6145 27.0854 20.9487 27.619 20.0912C28.155 19.2296 28.4186 18.2115 28.4186 17.0458C28.4186 15.8862 28.1577 14.7054 27.619 13.8397C27.0853 12.982 26.3419 12.3251 25.3946 11.8699C24.4639 11.3956 23.3703 11.1626 22.1208 11.1626H15.5216V13.6476H21.792C23.1949 13.6476 24.1727 13.9367 24.7728 14.4701C25.3664 14.9978 25.687 15.9454 25.687 17.0458C25.687 18.1151 25.3733 18.9095 24.7716 19.4618Z"
          fill="url(#paint0_linear_1056_11606)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40 20.5C40 31.5457 31.0457 40.5 20 40.5C8.9543 40.5 0 31.5457 0 20.5C0 9.4543 8.9543 0.5 20 0.5C31.0457 0.5 40 9.4543 40 20.5ZM37.38 20.5C37.38 30.0987 29.5987 37.88 20 37.88C10.4013 37.88 2.62 30.0987 2.62 20.5C2.62 10.9013 10.4013 3.12 20 3.12C29.5987 3.12 37.38 10.9013 37.38 20.5Z"
          fill="url(#paint1_linear_1056_11606)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1056_11606"
            x1="92.3373"
            y1="10.8034"
            x2="92.2666"
            y2="46.7934"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF2E72" />
            <stop offset="0.934908" stopColor="#4A125E" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1056_11606"
            x1="92.3373"
            y1="10.8034"
            x2="92.2666"
            y2="46.7934"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF2E72" />
            <stop offset="0.934908" stopColor="#4A125E" />
          </linearGradient>
        </defs>
      </Icon>
    );
  }

  if(variant === 'b&w') {
  component = (
    <Icon color={colorMode === 'light' ? 'black' : 'white'} {...rest}  viewBox="0 0 40 40">
      <path
        d="M24.7716 18.9618C24.1713 19.4945 23.1939 19.7832 21.792 19.7832H15.5216V29.3374H18.1436V22.2682H22.1208C23.3702 22.2682 24.4634 22.0444 25.3938 21.5887L25.3954 21.5879C26.3422 21.1145 27.0854 20.4487 27.619 19.5912C28.155 18.7296 28.4186 17.7115 28.4186 16.5458C28.4186 15.3862 28.1577 14.2054 27.619 13.3397C27.0853 12.482 26.3419 11.8251 25.3946 11.3699C24.4639 10.8956 23.3703 10.6626 22.1208 10.6626H15.5216V13.1476H21.792C23.1949 13.1476 24.1727 13.4367 24.7728 13.9701C25.3664 14.4978 25.687 15.4454 25.687 16.5458C25.687 17.6151 25.3733 18.4095 24.7716 18.9618Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM37.38 20C37.38 29.5987 29.5987 37.38 20 37.38C10.4013 37.38 2.62 29.5987 2.62 20C2.62 10.4013 10.4013 2.62 20 2.62C29.5987 2.62 37.38 10.4013 37.38 20Z"
        fill="currentColor"
      />
    </Icon>
  );
  }

  if(link) {
    return (
      <Link as={RouterLink} to={link}>{component}</Link>
    )
  }

  return component;
};

export default LogoCircle;
