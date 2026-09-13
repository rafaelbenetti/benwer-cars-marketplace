"use client";

import { useId, useMemo, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompanyMark } from "./CompanyMark";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Company } from "@/types/company";
import { cn } from "@/lib/utils";

interface CompanyFilterGroupProps {
  companies: Company[];
  selectedSlugs: string[];
  onChange: (slugs: string[] | undefined) => void;
  idPrefix?: string;
}

export function CompanyFilterGroup({
  companies,
  selectedSlugs,
  onChange,
  idPrefix = "company-filter",
}: CompanyFilterGroupProps) {
  const t = useTranslations("cars");
  const listId = useId();
  const [query, setQuery] = useState("");
  const selected = new Set(selectedSlugs);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return companies;
    }

    return companies.filter((company) =>
      company.name.toLowerCase().includes(normalized),
    );
  }, [companies, query]);

  function toggleCompany(slug: string, nextChecked: boolean) {
    const next = new Set(selectedSlugs);
    if (nextChecked) {
      next.add(slug);
    } else {
      next.delete(slug);
    }

    const slugs = [...next];
    onChange(slugs.length ? slugs : undefined);
  }

  return (
    <div className="min-w-0" role="group" aria-labelledby={`${idPrefix}-label`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p id={`${idPrefix}-label`} className="text-xs font-medium text-muted-foreground">
          {t("filters.company")}
        </p>
        {selectedSlugs.length ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
            className="h-auto px-1.5 py-0.5 text-xs"
          >
            {t("clearCompanies")}
          </Button>
        ) : null}
      </div>
      {companies.length > 6 ? (
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("companyPlaceholder")}
          aria-label={t("companyPlaceholder")}
          className="mb-2 h-8"
        />
      ) : null}
      <p className="mb-2 text-xs text-muted-foreground">
        {selectedSlugs.length
          ? t("companiesSelected", { count: selectedSlugs.length })
          : t("allCompanies")}
      </p>
      <ul
        id={listId}
        className="flex max-h-72 flex-col gap-0.5 overflow-y-auto"
        aria-label={t("filters.company")}
      >
        {matches.map((company) => {
          const checkboxId = `${idPrefix}-${company.slug}`;
          const isSelected = selected.has(company.slug);

          return (
            <li key={company.slug}>
              <label
                htmlFor={checkboxId}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm",
                  "hover:bg-surface-hover",
                  isSelected && "bg-primary/5",
                )}
              >
                <Checkbox.Root
                  id={checkboxId}
                  checked={isSelected}
                  onCheckedChange={(value) => toggleCompany(company.slug, value === true)}
                  className={cn(
                    "flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-strong bg-surface",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                  )}
                >
                  <Checkbox.Indicator>
                    <Check size={12} aria-hidden />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <CompanyMark company={company} size="sm" />
                <span className="min-w-0 truncate text-foreground">{company.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
