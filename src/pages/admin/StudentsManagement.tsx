
import { useEffect, useState } from "react";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Student = {
  id: string;
  email: string;
  name: string | null;
  created_at: string | null;
};

const studentFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // First check if the email already exists in allowed_google_emails
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('allowed_google_emails')
        .select('*')
        .eq('email', values.email)
        .single();
      
      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        throw emailCheckError;
      }
      
      if (existingEmail) {
        toast.error("This email is already registered");
        return;
      }
      
      // Insert into allowed_google_emails
      const { error: insertError } = await supabase
        .from('allowed_google_emails')
        .insert({
          email: values.email,
          role: 'student'
        });
      
      if (insertError) throw insertError;
      
      toast.success("Student added successfully! They can now register with this email.");
      form.reset();
      setIsAddDialogOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string, email: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }
    
    try {
      // First, we need to delete the student from allowed_google_emails
      const { error: allowedEmailError } = await supabase
        .from('allowed_google_emails')
        .delete()
        .eq('email', email);
        
      if (allowedEmailError) throw allowedEmailError;
      
      // Then, we delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (profileError) throw profileError;
      
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
        <p className="text-muted-foreground">
          Manage student accounts and course enrollments.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Add a new student to the system. They will be able to register with this email.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Student's name" {...field} />
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
                        <Input type="email" placeholder="student@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Student"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name || 'N/A'}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.created_at 
                        ? new Date(student.created_at).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStudent(student.id, student.email)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
