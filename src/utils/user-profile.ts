
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth-types";

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return {
      id: userId,
      email: profile.email,
      role: profile.role,
      name: profile.name
    };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
}
