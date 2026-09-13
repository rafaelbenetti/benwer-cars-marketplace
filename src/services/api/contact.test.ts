import { describe, expect, it } from "vitest";
import {
  MARKETPLACE_CONTACT_SOURCE,
  buildMarketplaceContactBody,
} from "./contact";

describe("buildMarketplaceContactBody", () => {
  it("tags inbound email as marketplace and prefixes the subject", () => {
    expect(
      buildMarketplaceContactBody({
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Fleet listing",
        message: "How do companies join the marketplace?",
      }),
    ).toEqual({
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "[Marketplace] Fleet listing",
      message: "How do companies join the marketplace?",
      source: MARKETPLACE_CONTACT_SOURCE,
    });
  });
});
