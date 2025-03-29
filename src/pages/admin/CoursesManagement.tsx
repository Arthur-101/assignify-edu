
import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Course = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  teacher_id: string | null;
  created_at: string | null;
  teacher_name: string | null;
  teacher_email: string | null;
};

type Teacher = {
  id: string;
  name: string | null;
  email: string;
};

const courseFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  code: z.string().min(2, "Code must be at least 2 characters").max(20),
  description: z.string().optional(),
  teacher_id: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      teacher_id: undefined,
    },
  });

  const editForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      teacher_id: undefined,
    },
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (editingCourse && isEditDialogOpen) {
      editForm.reset({
        name: editingCourse.name,
        code: editingCourse.code,
        description: editingCourse.description || "",
        teacher_id: editingCourse.teacher_id || undefined,
      });
    }
  }, [editingCourse, isEditDialogOpen, editForm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (
            name,
            email
          )
        `);

      if (error) throw error;
      
      const formattedCourses: Course[] = data.map(course => ({
        id: course.id,
        name: course.name,
        code: course.code,
        description: course.description,
        teacher_id: course.teacher_id,
        created_at: course.created_at,
        teacher_name: course.profiles ? course.profiles.name : null,
        teacher_email: course.profiles ? course.profiles.email : null,
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'teacher');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const onSubmit = async (values: CourseFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if course code already exists
      const { data: existingCourse, error: codeCheckError } = await supabase
        .from('courses')
        .select('id')
        .eq('code', values.code)
        .single();
      
      if (codeCheckError && codeCheckError.code !== 'PGRST116') {
        throw codeCheckError;
      }
      
      if (existingCourse) {
        toast.error("Course code already exists");
        return;
      }
      
      // Insert new course
      const { error: insertError } = await supabase
        .from('courses')
        .insert({
          name: values.name,
          code: values.code,
          description: values.description,
          teacher_id: values.teacher_id || null,
        });
      
      if (insertError) throw insertError;
      
      toast.success("Course added successfully!");
      form.reset();
      setIsAddDialogOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (values: CourseFormValues) => {
    if (!editingCourse) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if course code already exists and it's not the current course
      if (values.code !== editingCourse.code) {
        const { data: existingCourse, error: codeCheckError } = await supabase
          .from('courses')
          .select('id')
          .eq('code', values.code)
          .single();
        
        if (codeCheckError && codeCheckError.code !== 'PGRST116') {
          throw codeCheckError;
        }
        
        if (existingCourse) {
          toast.error("Course code already exists");
          return;
        }
      }
      
      // Update course
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          name: values.name,
          code: values.code,
          description: values.description,
          teacher_id: values.teacher_id || null,
        })
        .eq('id', editingCourse.id);
      
      if (updateError) throw updateError;
      
      toast.success("Course updated successfully!");
      editForm.reset();
      setIsEditDialogOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all assignments and student enrollments.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
        <p className="text-muted-foreground">
          Manage courses, assignments and enrollments.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course and assign it to a teacher.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the course" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teacher_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No teacher assigned</SelectItem>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name || teacher.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      "Add Course"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Course Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course details and teacher assignment.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the course" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="teacher_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No teacher assigned</SelectItem>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name || teacher.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Course"
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
                <TableHead>Code</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.teacher_name || course.teacher_email || 'No teacher assigned'}</TableCell>
                    <TableCell>
                      {course.created_at 
                        ? new Date(course.created_at).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
