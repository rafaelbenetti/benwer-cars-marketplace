"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { useCreateReservation } from "@/hooks/useCreateReservation";
import { getErrorKey } from "@/lib/errors";
import { logError } from "@/lib/logger";
import type { Vehicle } from "@/types/vehicle";

const schema = z
  .object({
    guestName: z.string().min(2, "Name must be at least 2 characters"),
    guestEmail: z.string().email("Enter a valid email address"),
    guestPhone: z.string().min(7, "Enter a valid phone number"),
    startDate: z.string().min(1, "Select a pick-up date"),
    endDate: z.string().min(1, "Select a drop-off date"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Drop-off must be after pick-up",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  vehicle: Vehicle;
  companySlug: string;
  defaultFrom?: string;
  defaultTo?: string;
}

export function BookingForm({
  vehicle,
  companySlug,
  defaultFrom = "",
  defaultTo = "",
}: BookingFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      startDate: defaultFrom,
      endDate: defaultTo,
    },
  });

  const { mutate, isPending } = useCreateReservation({
    companySlug,
    onSuccess: (reservation) => {
      router.push(`/booking/${reservation.token}`);
    },
  });

  function onSubmit(values: FormValues) {
    mutate({
      vehicleId: vehicle.id,
      startDate: values.startDate,
      endDate: values.endDate,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
    });
  }

  function onError() {
    toast.error("Please fix the errors above before submitting.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-5"
      noValidate
    >
      <Field
        label="Full name"
        htmlFor="guestName"
        error={errors.guestName?.message}
        required
      >
        <Input
          id="guestName"
          type="text"
          autoComplete="name"
          {...register("guestName")}
        />
      </Field>

      <Field
        label="Email address"
        htmlFor="guestEmail"
        error={errors.guestEmail?.message}
        required
      >
        <Input
          id="guestEmail"
          type="email"
          autoComplete="email"
          {...register("guestEmail")}
        />
      </Field>

      <Field
        label="Phone number"
        htmlFor="guestPhone"
        error={errors.guestPhone?.message}
        required
      >
        <Input
          id="guestPhone"
          type="tel"
          autoComplete="tel"
          {...register("guestPhone")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Pick-up date"
          htmlFor="startDate"
          error={errors.startDate?.message}
          required
        >
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
          />
        </Field>

        <Field
          label="Drop-off date"
          htmlFor="endDate"
          error={errors.endDate?.message}
          required
        >
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
          />
        </Field>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full mt-2">
        {isPending ? "Confirming…" : "Confirm booking"}
      </Button>
    </form>
  );
}
