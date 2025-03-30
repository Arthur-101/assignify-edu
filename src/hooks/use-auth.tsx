
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContextType, User } from "@/types/auth-types";
import { 
  getStoredAdminUser, 
  validateAdminCredentials, 
  createAdminUser, 
  storeAdminUser, 
  clearAdminUser 
} from "@/utils/admin-auth";
import { fetchUserProfile } from "@/utils/user-profile";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if admin user exists in localStorage first
        const adminUser = getStoredAdminUser();
        if (adminUser) {
          setUser(adminUser);
          setLoading(false);
          return;
        }

        // If not admin, check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
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
        // Skip if admin user is already set from localStorage
        if (getStoredAdminUser()) {
          return;
        }
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
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
      if (role === "admin") {
        if (validateAdminCredentials(email, password)) {
          const adminUser = createAdminUser();
          setUser(adminUser);
          storeAdminUser(adminUser);
          
          toast.success("Admin login successful!");
          navigate("/admin");
          return;
        } else {
          throw new Error("Invalid admin credentials");
        }
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
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (!userProfile) {
          throw new Error("Error fetching user profile");
        }

        if (role && userProfile.role !== role) {
          await supabase.auth.signOut();
          throw new Error(`You don't have ${role} privileges`);
        }

        toast.success("Login successful!");
        
        if (userProfile.role === "teacher") {
          navigate("/teacher");
        } else if (userProfile.role === "student") {
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
      if (getStoredAdminUser()) {
        clearAdminUser();
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
