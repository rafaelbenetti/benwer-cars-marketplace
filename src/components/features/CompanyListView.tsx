"use client";

import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyGridView } from "./CompanyGrid";
import { Input } from "@/components/ui/Input";
import type { Company } from "@/types/company";

export function CompanyListView() {
  const [query, setQuery] = useState("");
  const { data, isPending, isError, refetch } = useCompanies();

  const filtered: Company[] = (data ?? []).filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.location?.toLowerCase().includes(query.toLowerCase()) ?? false),
  );

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="search"
        placeholder="Search companies…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search rental companies"
        className="max-w-sm"
      />
      <CompanyGridView
        companies={query ? filtered : data}
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
}
