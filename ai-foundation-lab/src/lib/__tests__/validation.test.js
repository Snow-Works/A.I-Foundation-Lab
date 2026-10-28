// src/lib/__tests__/validation.test.js
import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "../validation.js";

describe("validation schemas", () => {
  describe("registerSchema", () => {
    const validData = {
      firstName: "Alice",
      surname: "Smith",
      email: "alice@example.com",
      whatsapp: { country: "NG", digits: "8012345678", display: "801 234 5678" },
      password: "password123",
      confirmPassword: "password123",
      agree: true,
    };

    it("passes with valid data", () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if passwords do not match", () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Passwords do not match.");
    });

    it("fails if WhatsApp number is invalid for the country", () => {
      const result = registerSchema.safeParse({
        ...validData,
        whatsapp: { ...validData.whatsapp, digits: "123" }, // NG needs 10 digits
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain("Enter a valid phone number");
    });
  });

  describe("loginSchema", () => {
    it("passes with valid email and password", () => {
      const result = loginSchema.safeParse({ email: "a@b.com", password: "x" });
      expect(result.success).toBe(true);
    });

    it("fails on invalid email format", () => {
      const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("passes with valid new passwords", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("fails if new password is less than 8 chars", () => {
      const result = resetPasswordSchema.safeParse({
        password: "short",
        confirmPassword: "short",
      });
      expect(result.success).toBe(false);
    });
  });
});