
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
import { Loader2, ShieldAlert, School, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
      email: "",
      password: "",
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
  
  const selectedRole = form.watch("role");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Home
      </Link>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Assignify Login</CardTitle>
          <CardDescription>Choose your role and login to continue</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">Select your role</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className={`relative cursor-pointer rounded-xl p-4 text-center hover:bg-accent transition-all ${
                            selectedRole === "admin" 
                              ? "bg-primary/10 border-2 border-primary" 
                              : "border border-input"
                          }`}
                          onClick={() => form.setValue("role", "admin")}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            checked={selectedRole === "admin"}
                            onChange={() => {}}
                          />
                          <div className="flex flex-col items-center gap-1">
                            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 text-purple-600 dark:text-purple-400">
                              <ShieldAlert className="h-6 w-6" />
                            </div>
                            <span className="mt-2 font-medium text-sm">Admin</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`relative cursor-pointer rounded-xl p-4 text-center hover:bg-accent transition-all ${
                            selectedRole === "teacher" 
                              ? "bg-primary/10 border-2 border-primary" 
                              : "border border-input"
                          }`}
                          onClick={() => form.setValue("role", "teacher")}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            checked={selectedRole === "teacher"}
                            onChange={() => {}}
                          />
                          <div className="flex flex-col items-center gap-1">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                              <School className="h-6 w-6" />
                            </div>
                            <span className="mt-2 font-medium text-sm">Teacher</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`relative cursor-pointer rounded-xl p-4 text-center hover:bg-accent transition-all ${
                            selectedRole === "student" 
                              ? "bg-primary/10 border-2 border-primary" 
                              : "border border-input"
                          }`}
                          onClick={() => form.setValue("role", "student")}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            checked={selectedRole === "student"}
                            onChange={() => {}}
                          />
                          <div className="flex flex-col items-center gap-1">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                              <UserCircle2 className="h-6 w-6" />
                            </div>
                            <span className="mt-2 font-medium text-sm">Student</span>
                          </div>
                        </div>
                      </div>
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
                      <Input 
                        placeholder={selectedRole === "admin" ? "admin@example.com" : "Enter your email"} 
                        {...field} 
                      />
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
                      <Input 
                        type="password" 
                        placeholder={selectedRole === "admin" ? "password123" : "••••••••"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {selectedRole === "admin" && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium">Admin credentials:</p>
                  <p>Email: admin@example.com</p>
                  <p>Password: password123</p>
                </div>
              )}
              
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
        </CardContent>
      </Card>
    </div>
  );
}
