"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { NavRoutes } from "@/enums";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useContact } from "@/hooks/useContact";
import { createContactSchema, type ContactFormValues } from "@/lib/contactSchema";
import { getErrorKey } from "@/lib/errors";

export function ContactForm() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const tRoot = useTranslations();
  const schema = createContactSchema({
    nameMin: t("errors.nameMin"),
    email: t("errors.email"),
    subjectMin: t("errors.subjectMin"),
    messageMin: t("errors.messageMin"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const contact = useContact(() => {
    reset();
    toast.success(t("success"));
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit((values) => {
        contact.mutate(values, {
          onError: (error) => {
            toast.error(tRoot(getErrorKey(error)));
          },
        });
      })}
    >
      <Field label={t("name")} htmlFor="name" error={errors.name?.message} required>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          className="h-11"
          {...register("name")}
        />
      </Field>
      <Field label={t("email")} htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          className="h-11"
          {...register("email")}
        />
      </Field>
      <Field
        label={t("subject")}
        htmlFor="subject"
        error={errors.subject?.message}
        required
      >
        <Input id="subject" type="text" className="h-11" {...register("subject")} />
      </Field>
      <Field
        label={t("message")}
        htmlFor="message"
        error={errors.message?.message}
        required
      >
        <Textarea id="message" rows={6} {...register("message")} />
      </Field>
      <Button type="submit" size="lg" isLoading={contact.isPending} className="w-full sm:w-auto">
        {t("submit")}
      </Button>
      <p className="text-sm text-muted-foreground">
        {t("privacyNote")}{" "}
        <Link
          href={NavRoutes.PRIVACY}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {tNav("privacy")}
        </Link>
      </p>
    </form>
  );
}
