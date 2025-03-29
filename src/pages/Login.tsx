
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, UserCircle2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "student"])
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Assignify</h1>
          <p className="text-muted-foreground mt-2">Login to continue</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select your role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors duration-200 w-full sm:w-auto">
                        <RadioGroupItem value="admin" id="admin" />
                        <label htmlFor="admin" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle2 className="h-5 w-5 text-primary" />
                          </div>
                          Admin
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors duration-200 w-full sm:w-auto">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <label htmlFor="teacher" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <UserCircle2 className="h-5 w-5 text-blue-500" />
                          </div>
                          Teacher
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors duration-200 w-full sm:w-auto">
                        <RadioGroupItem value="student" id="student" />
                        <label htmlFor="student" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <UserCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          Student
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
