
export type User = {
  id: string;
  email: string;
  role: string;
  name: string | null;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
};
