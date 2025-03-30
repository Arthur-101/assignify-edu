
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_STORAGE_KEY } from "@/lib/auth-constants";
import { User } from "@/types/auth-types";

export function getStoredAdminUser(): User | null {
  const storedAdminUser = localStorage.getItem(ADMIN_STORAGE_KEY);
  return storedAdminUser ? JSON.parse(storedAdminUser) : null;
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createAdminUser(): User {
  return {
    id: "admin-id",
    email: ADMIN_EMAIL,
    role: "admin",
    name: "Administrator"
  };
}

export function storeAdminUser(adminUser: User): void {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
}

export function clearAdminUser(): void {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}
