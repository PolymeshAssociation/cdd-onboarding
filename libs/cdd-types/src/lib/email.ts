import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';

export const emailFormSchema = z.object({
  email: z.string().email(),
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: 'terms must be accepted to proceed',
  }),
  updatesAccepted: z.boolean(),
});

export const EmailDetailsZ = extendApi(emailFormSchema, {
  title: 'Capture User Email',
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

export class EmailDetailsDto extends createZodDto(EmailDetailsZ) {}
