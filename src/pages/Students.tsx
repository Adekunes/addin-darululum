/**
 * @file Students.tsx
 * @description This file defines the `Students` page component, which is responsible for displaying and managing a list of students.
 * It features functionality to search for students, view summary statistics (like total students, active students, and average attendance),
 * add new students, and edit existing student details through a dialog interface.
 * The component utilizes other custom components like `StudentDialog` for adding/editing students and `StudentList` for displaying them.
 * State management for search queries, selected student for editing, and dialog visibility is handled within this component.
 */
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StudentDialog } from "@/components/students/StudentDialog";
import { StudentList } from "@/components/students/StudentList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  date_of_birth: string | null;
  enrollment_date: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
  status: 'active' | 'inactive';
}

/**
 * @function Students
 * @description The main component for the students management page.
 * It handles the display of student statistics, a search input for filtering students,
 * a list of students, and a dialog for adding or editing student information.
 * @returns {JSX.Element} The rendered students page.
 */
const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Example stats - in a real app these would come from your data source
  const stats = {
    totalStudents: 150,
    activeStudents: 142,
    avgAttendance: 95
  };

  /**
   * @function handleEditStudent
   * @description Sets the selected student and opens the dialog for editing.
   * @param {Student} student - The student object to be edited.
   * @input student - The student data to populate the edit dialog.
   * @output Opens the student editing dialog pre-filled with the selected student's information.
   * @returns {void}
   */
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  /**
   * @function handleAddStudent
   * @description Clears any selected student and opens the dialog for adding a new student.
   * @input None.
   * @output Opens the student dialog in "add new" mode.
   * @returns {void}
   */
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsDialogOpen(true);
  };

  /**
   * @function handleCloseDialog
   * @description Clears the selected student and closes the student dialog.
   * @input None.
   * @output Closes the student dialog and resets the selected student state.
   * @returns {void}
   */
  const handleCloseDialog = () => {
    setSelectedStudent(null);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Students</h1>
              <p className="text-muted-foreground">Manage and monitor student progress</p>
            </div>
            <Button onClick={handleAddStudent} className="gap-2">
              <UserPlus className="h-5 w-5" />
              Add Student
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:bg-purple-900/20">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Students</CardTitle>
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeStudents} active students
                </p>
                <Progress value={stats.avgAttendance} className="mt-3" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {stats.avgAttendance}% average attendance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white dark:bg-card shadow-sm rounded-lg border">
          <div className="p-4 border-b">
            <div className="relative flex max-w-sm items-center">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search students by name or guardian..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="pl-9"
              />
            </div>
          </div>
          <StudentList searchQuery={searchQuery} onEdit={handleEditStudent} />
        </div>
      </div>

      <StudentDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedStudent={selectedStudent} 
        onClose={handleCloseDialog} 
      />
    </DashboardLayout>
  );
};

export default Students;
