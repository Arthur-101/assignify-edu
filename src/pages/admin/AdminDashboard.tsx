
import { useEffect, useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Loader2, 
  User, 
  Users,
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type DashboardStats = {
  teacherCount: number;
  studentCount: number;
  courseCount: number;
  assignmentCount: number;
  completedSubmissions: number;
  lateSubmissions: number;
  loading: boolean;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    teacherCount: 0,
    studentCount: 0,
    courseCount: 0,
    assignmentCount: 0,
    completedSubmissions: 0,
    lateSubmissions: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count teachers
        const { count: teacherCount, error: teacherError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher');

        if (teacherError) throw teacherError;

        // Count students
        const { count: studentCount, error: studentError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        if (studentError) throw studentError;

        // Count courses
        const { count: courseCount, error: courseError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        if (courseError) throw courseError;

        // Count assignments
        const { count: assignmentCount, error: assignmentError } = await supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true });

        if (assignmentError) throw assignmentError;

        // Count completed submissions
        const { count: completedSubmissions, error: completedError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'graded');

        if (completedError) throw completedError;

        // Count late submissions
        const { data: lateSubmissionsData, error: lateError } = await supabase
          .from('submissions')
          .select('*, assignments!inner(deadline)')
          .lt('assignments.deadline', 'submitted_at');

        if (lateError) throw lateError;

        setStats({
          teacherCount: teacherCount || 0,
          studentCount: studentCount || 0,
          courseCount: courseCount || 0,
          assignmentCount: assignmentCount || 0,
          completedSubmissions: completedSubmissions || 0,
          lateSubmissions: lateSubmissionsData?.length || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your educational platform stats.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teacherCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered teacher accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered student accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courseCount}</div>
            <p className="text-xs text-muted-foreground">
              Total courses in the platform
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentCount}</div>
            <p className="text-xs text-muted-foreground">
              Total assignments created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Assignments submitted and graded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late Submissions</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lateSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Assignments submitted after deadline
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed will be displayed here. Currently in development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
