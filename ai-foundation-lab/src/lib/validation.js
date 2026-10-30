// src/lib/validation.js
import { z } from "zod";

const COUNTRY_DIGITS = {
  NG: 10, US: 10, GB: 10, GH: 9, KE: 9, ZA: 9,
};

const phoneSchema = z
  .object({
    display: z.string(),
    digits: z.string(),
    country: z.string(),
  })
  .refine(
    (val) => {
      const expected = COUNTRY_DIGITS[val.country];
      if (!expected) return false;
      return val.digits.length === expected;
    },
    { message: "Enter a valid phone number for the selected country." }
  );

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(60, "First name must be 60 characters or fewer."),
    middleName: z
      .string()
      .trim()
      .max(60, "Middle name must be 60 characters or fewer.")
      .optional()
      .or(z.literal("")),
    surname: z
      .string()
      .trim()
      .min(1, "Surname is required.")
      .max(60, "Surname must be 60 characters or fewer."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address.")
      .max(160, "Email must be 160 characters or fewer."),
    whatsapp: phoneSchema,
    batch: z
      .string()
      .trim()
      .max(60, "Batch must be 60 characters or fewer.")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    agree: z.literal(true, {
      errorMap: () => ({ message: "You must confirm this before continuing." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function zodToFieldErrors(zodError) {
  const errors = {};
  for (const issue of zodError.issues) {
    const path = issue.path[0];
    if (path && !errors[path]) errors[path] = issue.message;
  }
  return errors;
}

export const identitySchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});