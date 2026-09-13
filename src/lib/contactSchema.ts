import { z } from "zod";

export interface ContactSchemaMessages {
  nameMin: string;
  email: string;
  subjectMin: string;
  messageMin: string;
}

export function createContactSchema(messages: ContactSchemaMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.nameMin),
    email: z.email(messages.email),
    subject: z.string().trim().min(3, messages.subjectMin),
    message: z.string().trim().min(10, messages.messageMin),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
