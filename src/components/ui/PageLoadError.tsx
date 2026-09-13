"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { EmptyState } from "./EmptyState";

interface PageLoadErrorProps {
  title: string;
  description: string;
}

export function PageLoadError({ title, description }: PageLoadErrorProps) {
  const router = useRouter();
  const t = useTranslations("actions");

  return (
    <EmptyState
      icon={<AlertCircle size={28} />}
      title={title}
      description={description}
      actionLabel={t("retry")}
      onAction={() => router.refresh()}
    />
  );
}
