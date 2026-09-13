"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SearchFieldSegment } from "./SearchFieldSegment";
import { Input } from "@/components/ui/Input";
import { useCompanies } from "@/hooks/useCompanies";
import { DEFAULT_CITY_SLUG, isProvinceWideLocation } from "@/data/malagaCities";
import {
  filterInventoryLocations,
  inventoryLocationsFromCompanies,
  locationLabelFromSlug,
} from "@/lib/locationOptions";
import { cn } from "@/lib/utils";

interface CityComboboxProps {
  value: string;
  onChange: (slug: string) => void;
  from?: string;
  to?: string;
}

export function CityCombobox({ value, onChange, from, to }: CityComboboxProps) {
  const t = useTranslations("search");
  const locale = useLocale();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const companiesQuery = useCompanies(
    from && to
      ? {
          from,
          to,
        }
      : undefined,
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inventory = useMemo(
    () => inventoryLocationsFromCompanies(companiesQuery.data ?? [], locale),
    [companiesQuery.data, locale],
  );
  const matches = useMemo(
    () => filterInventoryLocations(inventory, query),
    [inventory, query],
  );
  const options = useMemo(
    () => [{ slug: DEFAULT_CITY_SLUG, label: t("allLocations") }, ...matches],
    [matches, t],
  );

  const selectedName = isProvinceWideLocation(value)
    ? t("allLocations")
    : inventory.find((location) => location.slug === value)?.label ??
      locationLabelFromSlug(value, locale);

  useEffect(() => {
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
      setHighlightedIndex(0);
    }
  }

  function selectCity(slug: string) {
    onChange(slug);
    setOpen(false);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setHighlightedIndex(Math.max(options.length - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) {
        selectCity(option.slug);
      }
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <SearchFieldSegment
          icon={<MapPin size={16} aria-hidden />}
          label={t("locationLabel")}
          value={selectedName}
          isActive={open}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t("locationTrigger", { city: selectedName })}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] min-w-[min(100vw-1.5rem,18rem)] rounded-xl border border-border bg-surface p-2 shadow-md outline-none",
            "max-md:w-[min(100vw-1.5rem,var(--radix-popover-trigger-width))]",
          )}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={t("locationPlaceholder")}
            aria-label={t("locationPlaceholder")}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={
              options[highlightedIndex]
                ? `${listId}-${options[highlightedIndex]?.slug}`
                : undefined
            }
            role="combobox"
            aria-expanded={open}
            className="mb-2"
          />
          {options.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("locationEmpty")}
            </p>
          ) : (
            <ul
              id={listId}
              role="listbox"
              aria-label={t("cityListLabel")}
              className="max-h-64 overflow-y-auto"
            >
              {options.map((option, index) => {
                const isAll = isProvinceWideLocation(option.slug);
                const isSelected = isAll
                  ? isProvinceWideLocation(value)
                  : option.slug === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={option.slug}
                    id={`${listId}-${option.slug}`}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm",
                      isHighlighted && "bg-surface-hover",
                      isSelected && "font-medium text-foreground",
                      !isSelected && "text-foreground",
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectCity(option.slug)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {isAll ? (
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          {t("allLocationsHint")}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <Check size={16} className="shrink-0 text-primary" aria-hidden />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
