import { describe, expect, it } from "vitest";
import { readLegalSections } from "./legal";

describe("readLegalSections", () => {
  it("keeps titled sections with body copy", () => {
    expect(
      readLegalSections([
        { title: "Who we are", body: "Benwer operates a marketplace." },
        { title: "", body: "skip" },
        { title: "Cookies", body: "Language cookie only." },
      ]),
    ).toEqual([
      { title: "Who we are", body: "Benwer operates a marketplace." },
      { title: "Cookies", body: "Language cookie only." },
    ]);
  });

  it("returns an empty list for invalid payloads", () => {
    expect(readLegalSections(null)).toEqual([]);
    expect(readLegalSections({ title: "Nope" })).toEqual([]);
    expect(readLegalSections(["plain"])).toEqual([]);
  });
});
