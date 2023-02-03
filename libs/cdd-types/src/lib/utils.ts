import { z } from 'zod';

export const base58Regex = /^[A-HJ-NP-Za-km-z1-9]*$/;

export const addressZ = z.string().regex(base58Regex).min(47).max(48);
