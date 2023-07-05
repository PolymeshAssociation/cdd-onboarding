import { useContext } from 'react';
import z from 'zod';

import { HCaptchaContext } from '../components/HCaptcha/HCaptchaContext';
 
export const hCaptcha = z.string().nonempty();

export const useCaptcha = () => useContext(HCaptchaContext);
