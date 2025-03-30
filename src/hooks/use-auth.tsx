
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  role: string;
  name: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - hardcoded for development only
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "password123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setUser(null);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              name: profile.name
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setUser(null);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              name: profile.name
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    try {
      setLoading(true);
      
      // Special case for admin login - completely separate from Supabase auth
      if (role === "admin" && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Create a mock admin user without going through Supabase
        const adminUser = {
          id: "admin-id",
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Administrator"
        };
        
        // Set the admin user in state
        setUser(adminUser);
        
        // Store in localStorage for persistence
        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        
        toast.success("Admin login successful!");
        navigate("/admin");
        return;
      }

      // Regular user login through Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw new Error(error.message);
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          throw new Error("Error fetching user profile");
        }

        if (role && profile.role !== role) {
          await supabase.auth.signOut();
          throw new Error(`You don't have ${role} privileges`);
        }

        toast.success("Login successful!");
        
        if (profile.role === "teacher") {
          navigate("/teacher");
        } else if (profile.role === "student") {
          navigate("/student");
        }
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if it's the admin user (stored in localStorage)
      const adminUser = localStorage.getItem("adminUser");
      if (adminUser) {
        localStorage.removeItem("adminUser");
        setUser(null);
        navigate("/");
        toast.success("Admin logged out successfully");
        return;
      }
      
      // Regular user logout through Supabase
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  // Check for admin user in localStorage during initialization
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser && !user) {
      setUser(JSON.parse(adminUser));
      setLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
