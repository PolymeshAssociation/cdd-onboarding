import { z } from 'zod';

export const base58Regex = /^[A-HJ-NP-Za-km-z1-9]*$/;

export const addressZ = z.string().regex(base58Regex, 'Invalid characters entered').min(47, 'Address must be at least 47 characters in length').max(48, 'Address must be at most 48 characters in length');
