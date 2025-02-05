export type UserRole = "admin" | "user";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase());

export function assignUserRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : "user";
}
