import { describe, expect, it } from "vitest";
import { safeNext, slugify, validateContact, validatePassword } from "@/lib/validation";

describe("validateContact", () => {
  const ok = { name: "Jane", email: "jane@example.org", message: "We would like to volunteer next month." };
  it("accepts a normal message", () => expect(validateContact(ok)).toBeNull());
  it.each([
    [{ ...ok, name: " " }, "name"],
    [{ ...ok, name: "x".repeat(101) }, "name"],
    [{ ...ok, email: "not-an-email" }, "email"],
    [{ ...ok, message: "too short" }, "message"],
    [{ ...ok, message: "x".repeat(4001) }, "message"],
  ])("rejects %j", (input, field) => expect(validateContact(input)).toBe(field));
});

describe("validatePassword", () => {
  it("needs 8 to 72 characters", () => {
    expect(validatePassword("1234567")).toBe(false);
    expect(validatePassword("12345678")).toBe(true);
    expect(validatePassword("x".repeat(73))).toBe(false);
  });
});

describe("slugify", () => {
  it.each([
    ["Two days on the Kamarob trail!", "two-days-on-the-kamarob-trail"],
    ["  Spring — notes  ", "spring-notes"],
    ["Café déjà vu", "cafe-deja-vu"],
    ["Хабар", ""],
  ])("%s → %s", (text, slug) => expect(slugify(text)).toBe(slug));
});

describe("safeNext", () => {
  it.each([
    ["/en/account", "/en/account"],
    ["https://evil.example", "/fallback"],
    ["//evil.example", "/fallback"],
    ["/\\evil.example", "/fallback"],
    [null, "/fallback"],
  ])("%s → %s", (next, expected) => expect(safeNext(next, "/fallback")).toBe(expected));
});
