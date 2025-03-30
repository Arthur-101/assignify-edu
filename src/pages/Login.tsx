
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  const selectedRole = form.watch("role");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Assignify Login</CardTitle>
          <CardDescription>Login to continue to your dashboard</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel className="text-base">Select your role</FormLabel>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${selectedRole === "admin" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                            <RadioGroupItem value="admin" id="admin" className="sr-only" />
                            <label htmlFor="admin" className="cursor-pointer flex flex-col items-center gap-2 w-full">
                              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <ShieldAlert className="h-6 w-6 text-purple-500" />
                              </div>
                              <span className="font-medium">Admin</span>
                            </label>
                          </div>

                          <div className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${selectedRole === "teacher" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                            <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                            <label htmlFor="teacher" className="cursor-pointer flex flex-col items-center gap-2 w-full">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <School className="h-6 w-6 text-blue-500" />
                              </div>
                              <span className="font-medium">Teacher</span>
                            </label>
                          </div>

                          <div className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${selectedRole === "student" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                            <RadioGroupItem value="student" id="student" className="sr-only" />
                            <label htmlFor="student" className="cursor-pointer flex flex-col items-center gap-2 w-full">
                              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <UserCircle2 className="h-6 w-6 text-green-500" />
                              </div>
                              <span className="font-medium">Student</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
