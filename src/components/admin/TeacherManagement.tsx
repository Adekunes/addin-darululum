
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { CalendarClock, Loader2, School } from "lucide-react";

export const TeacherManagement = () => {
  // Get summary statistics for the dashboard
  const { data: teacherStats, isLoading } = useQuery({
    queryKey: ["teacher-stats"],
    queryFn: async () => {
      const { data: teachersData, error: teachersError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "teacher");

      if (teachersError) throw teachersError;

      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("id");

      if (classesError) throw classesError;

      return {
        teacherCount: teachersData ? teachersData.length : 0,
        scheduleCount: classesData ? classesData.length : 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : teacherStats?.teacherCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Teacher accounts managed by admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Teaching Schedules
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : teacherStats?.scheduleCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Created and managed through teacher profiles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Admin User Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Teacher management is now centralized. When you add a new teacher, a
          user account is automatically created for them. Only admins can create
          new accounts, and public registration is disabled.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <h4 className="text-sm font-medium text-blue-700 mb-1">
            Teacher Management Features
          </h4>
          <ul className="list-disc text-sm text-blue-700 pl-5 space-y-1">
            <li>Create teacher profiles and user accounts together</li>
            <li>Manage teaching schedules for each teacher</li>
            <li>Edit teacher information and credentials</li>
            <li>Monitor total accounts and schedules created</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
